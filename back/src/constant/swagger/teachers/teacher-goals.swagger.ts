import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

export const TEACHER_GOALS_PATH = '/teachers/me/goals';
export const TEACHER_GOAL_PATH = `${TEACHER_GOALS_PATH}/{goalId}`;

const TIMESTAMP = '2026-09-01T00:00:00.000Z';

export const TEACHER_GOALS_SWAGGER = {
  TAG: 'Teacher goals',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  GOAL_ID_DESCRIPTION: 'Id of the goal.',
  GOAL_ID_EXAMPLE: {
    id: '7d6c5b4a-3e2f-4a1b-9c8d-0e1f2a3b4c5d',
  },
  BODY: {
    TITLE: {
      EXAMPLE: 'Talk less, let students speak more',
      DESCRIPTION: 'Short name of the goal.',
    },
    DETAILS: {
      EXAMPLE: 'Keep my talking time under 30% of each lesson.',
      DESCRIPTION: 'Free-text notes about the goal.',
    },
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: TEACHER_GOALS_PATH,
    timestamp: TIMESTAMP,
  },
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the calling user is not a teacher.',
  GOAL_NOT_FOUND_DESCRIPTION:
    'Returned when the goal does not exist or belongs to another teacher.',
  GOAL_NOT_FOUND_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.TEACHER_GOAL_NOT_FOUND,
    message: 'Goal was not found.',
    path: TEACHER_GOAL_PATH,
    timestamp: TIMESTAMP,
  },
} as const;
