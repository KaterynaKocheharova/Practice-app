import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { teachersConfig } from 'src/modules/teachers/config';
import { TEACHER_GOALS_PATH } from './teacher-goals.swagger';

const { MAX_ACTIVE_PER_TEACHER } = teachersConfig.GOALS;

export const CREATE_TEACHER_GOAL_SWAGGER = {
  SUMMARY: 'Create a goal',
  DESCRIPTION: `Creates an active improvement goal for the calling teacher. A teacher can have at most ${MAX_ACTIVE_PER_TEACHER} active goals; completed goals do not count.`,
  CONFLICT_RESPONSE_DESCRIPTION: `Returned when the teacher already has ${MAX_ACTIVE_PER_TEACHER} active goals.`,
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.TEACHER_ACTIVE_GOALS_LIMIT_REACHED,
    message: 'You already have the maximum number of active goals.',
    path: TEACHER_GOALS_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  REQUEST_BODY_DESCRIPTION: 'Goal title and optional details.',
  CREATED_RESPONSE_DESCRIPTION: 'Goal created. Returns the id of the goal.',
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the body is invalid or has unknown fields.',
} as const;
