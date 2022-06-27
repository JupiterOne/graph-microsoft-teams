import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { MicrosoftTeamsTeam } from '../../types';

export function getTeamKey(name: string): string {
  return `microsoft_teams_team:${name}`;
}

export function createTeamEntity(team: MicrosoftTeamsTeam): Entity {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _type: Entities.TEAM._type,
        _class: Entities.TEAM._class,
        _key: getTeamKey(team.id),
        id: team.id,
        name: team.displayName,
        displayName: team.displayName,
        description: team.description || undefined,
        public: team.visibility === 'Public',
        securityEnabled: team.securityEnabled,
        mailEnabled: team.mailEnabled,
        mail: team.mail,
        createdOn: parseTimePropertyValue(team.createdDateTime),
        renewedOn: parseTimePropertyValue(team.renewedDateTime),
        deletedOn: parseTimePropertyValue(team.deletedDateTime),
        expiresOn: parseTimePropertyValue(team.expirationDateTime),
      },
    },
  });
}
