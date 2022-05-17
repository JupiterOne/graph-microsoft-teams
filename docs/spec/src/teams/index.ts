import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../src/config';

export const teamSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://graph.microsoft.com/v1.0/groups
     * PATTERN: Fetch Entities
     */
    id: 'fetch-teams',
    name: 'Fetch Teams',
    entities: [
      {
        resourceName: 'Team',
        _type: 'microsoft_teams_team',
        _class: ['Group'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_teams_account_has_team',
        sourceType: 'microsoft_teams_account',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_teams_team',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },

  {
    /**
     * ENDPOINT: https://graph.microsoft.com/v1.0/teams/{team-id}/members
     * PATTERN: Fetch Child Entities
     */
    id: 'build-team-user-relationships',
    name: 'Build Team and User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'microsoft_teams_team_has_user',
        sourceType: 'microsoft_teams_team',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_teams_user',
      },
    ],
    dependsOn: ['fetch-teams', 'fetch-users'],
    implemented: true,
  },
];
