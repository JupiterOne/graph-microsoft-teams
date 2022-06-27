import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-teams', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-teams',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.TEAMS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-team-user-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-team-user-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_TEAM_USER_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
