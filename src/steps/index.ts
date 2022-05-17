import { accountSteps } from './account';
import { channelSteps } from './channels';
import { teamSteps } from './teams';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...userSteps,
  ...teamSteps,
  ...channelSteps,
];

export { integrationSteps };
