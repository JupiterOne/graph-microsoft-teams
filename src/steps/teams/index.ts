import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { MicrosoftTeamsTeam } from '../../types';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { getUserKey } from '../users/converter';
import { createTeamEntity } from './converter';

export async function fetchTeams({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  try {
    await apiClient.iterateTeams(async (team) => {
      if (team.displayName != 'All Company') {
        const teamEntity = await jobState.addEntity(createTeamEntity(team));

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: teamEntity,
          }),
        );
      }
    });
  } catch (err) {
    if (err.status === 403) {
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description:
          '"Group.Read.All" is not a required permission to run the Microsoft Teams integration, but is required for getting teams data.',
      });
    }
  }
}

export async function buildTeamAndUserRelationship({
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
          'Could not get raw data for team entity',
        );
        return;
      }

      try {
        await apiClient.iterateTeamUsers(team.id, async (user) => {
          const userEntity = await jobState.findEntity(getUserKey(user.userId));

          if (userEntity)
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: teamEntity,
                to: userEntity,
              }),
            );
        });
      } catch (err) {
        if (err.status === 403) {
          logger.publishWarnEvent({
            name: IntegrationWarnEventName.MissingPermission,
            description:
              '"TeamMember.Read.All" is not a required permission to run the Microsoft Teams integration, but is required for getting team members data.',
          });
        }
      }
    },
  );
}

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ACCOUNT_HAS_TEAM],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchTeams,
  },
  {
    id: Steps.BUILD_TEAM_USER_RELATIONSHIPS,
    name: 'Build Team and User Relationships',
    entities: [],
    relationships: [Relationships.TEAM_HAS_USER],
    dependsOn: [Steps.TEAMS, Steps.USERS],
    executionHandler: buildTeamAndUserRelationship,
  },
];
