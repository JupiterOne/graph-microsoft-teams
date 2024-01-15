import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { MicrosoftTeamsUser } from '../../types';

export function getUserKey(name: string): string {
  return `microsoft_teams_user:${name}`;
}

export function createUserEntity(user: MicrosoftTeamsUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.id),
        id: user.id,
        username: user.displayName,
        name: user.givenName || user.displayName,
        active: true,
        lastname: user.surname,
        jobTitle: user.jobTitle,
        userPrincipalName: user.userPrincipalName,
      },
    },
  });
}
