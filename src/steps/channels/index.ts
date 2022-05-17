import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { MicrosoftTeamsTeam } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import { createChannelEntity } from './converter';

export async function fetchChannels({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.TEAM._type },
    async (teamEntity) => {
      const team = getRawData<MicrosoftTeamsTeam>(teamEntity);

      if (!team) {
        logger.warn(
          { _key: teamEntity._key },
          'Could not get raw data for channel entity',
        );
        return;
      }

      await apiClient.fetchTeamChannels(team.id, async (channel) => {
        const channelEntity = await jobState.addEntity(
          createChannelEntity(channel),
        );
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: teamEntity,
            to: channelEntity,
          }),
        );
      });
    },
  );
}

export const channelSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CHANNEL,
    name: 'Fetch Channels',
    entities: [Entities.CHANNEL],
    relationships: [Relationships.TEAM_HAS_CHANNEL],
    dependsOn: [Steps.TEAMS],
    executionHandler: fetchChannels,
  },
];
