import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';
export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  TEAMS: 'fetch-teams',
  BUILD_TEAM_USER_RELATIONSHIPS: 'build-team-user-relationships',
  CHANNEL: 'fetch-channels',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'TEAM' | 'CHANNEL',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'microsoft_teams_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'microsoft_teams_user',
    _class: ['User'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'microsoft_teams_team',
    _class: ['Group'],
  },
  CHANNEL: {
    resourceName: 'Channel',
    _type: 'microsoft_teams_channel',
    _class: ['Channel'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_TEAM'
  | 'TEAM_HAS_USER'
  | 'TEAM_HAS_CHANNEL',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'microsoft_teams_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_TEAM: {
    _type: 'microsoft_teams_account_has_team',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  TEAM_HAS_USER: {
    _type: 'microsoft_teams_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  TEAM_HAS_CHANNEL: {
    _type: 'microsoft_teams_team_has_channel',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CHANNEL._type,
  },
};
