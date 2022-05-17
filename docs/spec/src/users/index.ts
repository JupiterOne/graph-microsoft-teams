import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://graph.microsoft.com/v1.0/users/
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'microsoft_teams_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_teams_account_has_user',
        sourceType: 'microsoft_teams_account',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_teams_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
