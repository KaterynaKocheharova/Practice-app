import { TeacherGoalStatus } from 'src/modules/teachers/enums';

export const GET_TEACHER_GOALS_SWAGGER = {
  SUMMARY: 'List my goals',
  DESCRIPTION:
    "Returns a page of the calling teacher's goals (active only unless `status` says otherwise), newest first, each with the number of times it was marked as addressed. Also returns how many goals are active and the active goals limit, so the client knows whether a new goal can be added.",
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
        '`active` (default) returns goals that are not completed, `completed` returns completed ones, `all` returns both.',
    },
  },
  OK_RESPONSE_DESCRIPTION:
    'A page of goal cards, the total number of matching goals, the number of active goals regardless of the filter (`activeTotal`) and the active goals limit (`maxActive`). `completedAt` is null while the goal is active.',
  OK_RESPONSE_EXAMPLE: {
    items: [
      {
        id: '7d6c5b4a-3e2f-4a1b-9c8d-0e1f2a3b4c5d',
        title: 'Talk less, let students speak more',
        details: 'Keep my talking time under 30% of each lesson.',
        completedAt: null,
        createdAt: '2026-09-01T00:00:00.000Z',
        attemptCount: 3,
      },
    ],
    total: 1,
    activeTotal: 1,
    maxActive: 3,
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when limit, offset or status is invalid.',
} as const;
