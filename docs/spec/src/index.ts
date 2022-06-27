import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { userSpec } from './users';
import { teamSpec } from './teams';
import { channelSpec } from './channels';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...accountSpec, ...userSpec, ...teamSpec, ...channelSpec],
};
