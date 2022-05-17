import fetch, { Response } from 'node-fetch';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { retry } from '@lifeomic/attempt';
import { URLSearchParams } from 'url';

import { IntegrationConfig } from './config';
import {
  MicrosoftTeamsTeam,
  MicrosoftTeamsChannel,
  MicrosoftTeamsUser,
  MicrosoftTeamsTeamMember,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private baseUri = `https://graph.microsoft.com/v1.0/`;
  private authUri = `https://login.microsoftonline.com/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private withAuthUri = (path: string) => `${this.authUri}${path}`;
  private perPage = 200;
  private accessToken;

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async refreshToken(): Promise<any> {
    const response = await fetch(
      this.withAuthUri(`${this.config.tenantId}/oauth2/v2.0/token`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: `${this.config.clientId}`,
          client_secret: `${this.config.clientSecret}`,
          grant_type: 'client_credentials',
          scope: `https://graph.microsoft.com/.default`,
        }),
      },
    );

    const tokenResponse = await response.json();
    this.accessToken = tokenResponse.access_token;
  }

  private async getRequest(endpoint: string, method: 'GET'): Promise<Response> {
    if (!this.accessToken) {
      await this.refreshToken();
    }

    try {
      const options = {
        method,
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      };

      const response = await retry(
        async () => {
          const res: Response = await fetch(endpoint, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          factor: 2,
          maxAttempts: 5,
          minDelay: 100,
          maxDelay: 500,
          jitter: true,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            ) {
              context.abort();
            }
          },
        },
      );
      return response;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri(`users`);
    try {
      await this.getRequest(uri, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedRequest<T>(
    uri: string,
    method: 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let next = uri;
    do {
      if (next == 'undefined') {
        break;
      }
      const response = await this.getRequest(next, method);

      try {
        const response_json = await response.json();
        for (const item of response_json['value']) {
          await iteratee(item);
        }
        next = response_json['@odata.nextLink'];
      } catch (err) {
        break;
      }
    } while (next);
  }

  public async iterateUsers(
    iteratee: ResourceIteratee<MicrosoftTeamsUser>,
  ): Promise<void> {
    await this.paginatedRequest<MicrosoftTeamsUser>(
      this.withBaseUri(`users/?$top=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  public async iterateTeams(
    iteratee: ResourceIteratee<MicrosoftTeamsTeam>,
  ): Promise<void> {
    await this.paginatedRequest<MicrosoftTeamsTeam>(
      this.withBaseUri(`groups/?$top=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  public async iterateTeamUsers(
    team_id: string,
    iteratee: ResourceIteratee<MicrosoftTeamsTeamMember>,
  ): Promise<void> {
    await this.paginatedRequest<MicrosoftTeamsTeamMember>(
      this.withBaseUri(`teams/${team_id}/members/?$top=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  public async fetchTeamChannels(
    team_id: string,
    iteratee: ResourceIteratee<MicrosoftTeamsChannel>,
  ): Promise<void> {
    const response = await this.getRequest(
      this.withBaseUri(`teams/${team_id}/channels`),
      'GET',
    );
    const response_json = await response.json();

    for (const item of response_json.value) {
      await iteratee(item);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
