import { teachersConfig } from 'src/modules/teachers/config';

const { PROGRESS_CHECK_INTERVAL } = teachersConfig.GOALS;

export const ADD_TEACHER_GOAL_ATTEMPT_SWAGGER = {
  SUMMARY: 'Mark a goal as addressed',
  DESCRIPTION: `Records one attempt at an active goal of the calling teacher. Every ${PROGRESS_CHECK_INTERVAL} attempts a progress check becomes due, and no new attempt is accepted until it is answered. Read the new \`attemptCount\` and \`progressCheckDue\` from the goals list.`,
  NO_CONTENT_RESPONSE_DESCRIPTION: 'Attempt recorded.',
} as const;
