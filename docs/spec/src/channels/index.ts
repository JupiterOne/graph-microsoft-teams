import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../src/config';

export const channelSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://graph.microsoft.com/v1.0/teams/{team-id}/channels
     * PATTERN: Fetch Entities
     */
    id: 'fetch-channels',
    name: 'Fetch Channels',
    entities: [
      {
        resourceName: 'Channel',
        _type: 'microsoft_teams_channel',
        _class: ['Channel'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_teams_team_has_channel',
        sourceType: 'microsoft_teams_team',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_teams_channel',
      },
    ],
    dependsOn: ['fetch-teams'],
    implemented: true,
  },
];
