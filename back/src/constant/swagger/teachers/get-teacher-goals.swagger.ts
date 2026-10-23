import { teachersConfig } from 'src/modules/teachers/config';
import { TeacherGoalStatus } from 'src/modules/teachers/enums';

const { PROGRESS_CHECK_INTERVAL } = teachersConfig.GOALS;

export const GET_TEACHER_GOALS_SWAGGER = {
  SUMMARY: 'List my goals',
  DESCRIPTION:
    "Returns a page of the calling teacher's goals, newest first, each with the number of times it was marked as addressed.",
  QUERY: {
    LIMIT: {
      EXAMPLE: 20,
      DESCRIPTION: 'Maximum number of goals to return.',
    },
    OFFSET: {
      EXAMPLE: 0,
      DESCRIPTION: 'Number of goals to skip.',
    },
    STATUS: {
      EXAMPLE: TeacherGoalStatus.Active,
      DESCRIPTION:
        '`active` returns goals that are not completed, `completed` returns completed ones. Omit it to get both.',
    },
  },
  OK_RESPONSE_DESCRIPTION: `A page of goal cards and the total number of matching goals. \`completedAt\` is null while the goal is active. \`progressCheckDue\` is true when \`attemptCount\` reached a multiple of ${PROGRESS_CHECK_INTERVAL} and that progress check is not answered yet: show the "mark progress" button and block new marks and completion until it is answered.`,
  OK_RESPONSE_EXAMPLE: {
    items: [
      {
        id: '7d6c5b4a-3e2f-4a1b-9c8d-0e1f2a3b4c5d',
        title: 'Talk less, let students speak more',
        details: 'Keep my talking time under 30% of each lesson.',
        completedAt: null,
        createdAt: '2026-09-01T00:00:00.000Z',
        attemptCount: 5,
        progressCheckDue: true,
      },
    ],
    total: 1,
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when limit, offset or status is invalid.',
} as const;
