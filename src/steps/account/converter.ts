import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getAccountKey(name: string): string {
  return `microsoft_teams_account:${name}`;
}

export function createAccountEntity(account: {
  clientId: string;
  tenantId: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.clientId),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.tenantId,
      },
    },
  });
}
