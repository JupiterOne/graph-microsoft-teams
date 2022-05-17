import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { MicrosoftTeamsChannel } from '../../types';

export function getChannelKey(name: string): string {
  return `microsoft_teams_channel:${name}`;
}

export function createChannelEntity(channel: MicrosoftTeamsChannel): Entity {
  return createIntegrationEntity({
    entityData: {
      source: channel,
      assign: {
        _type: Entities.CHANNEL._type,
        _class: Entities.CHANNEL._class,
        _key: getChannelKey(channel.id),
        id: channel.id,
        displayName: channel.displayName,
        isFavoriteByDefault: channel.isFavoriteByDefault,
        name: channel.displayName,
        email: channel.email,
        membershipType: channel.membershipType,
        description: channel.description || undefined,
        webUrl: channel.webUrl,
        createdOn: parseTimePropertyValue(channel.createdDateTime),
      },
    },
  });
}
