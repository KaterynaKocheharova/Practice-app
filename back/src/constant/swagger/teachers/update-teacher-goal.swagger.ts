import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { TEACHER_GOAL_PATH } from './teacher-goals.swagger';

export const UPDATE_TEACHER_GOAL_SWAGGER = {
  SUMMARY: 'Update a goal',
  DESCRIPTION:
    'Partially updates a goal of the calling teacher. Only allowed until the goal is marked as addressed for the first time.',
  REQUEST_BODY_DESCRIPTION:
    'Send only the fields to change, at least one. `details` can be cleared with `null`; `title` cannot.',
  NULLABLE_FIELD_DESCRIPTION: 'Send `null` to clear it.',
  OK_RESPONSE_DESCRIPTION: 'Goal updated. Returns the id of the goal.',
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the id is not a valid UUID, the body is invalid or has unknown fields, or the body changes nothing.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.EMPTY_UPDATE_BODY,
    message: 'Nothing to update.',
    path: TEACHER_GOAL_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when the goal has already been marked as addressed at least once.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.TEACHER_GOAL_HAS_ATTEMPTS,
    message: 'This goal has already been marked and can no longer be edited.',
    path: TEACHER_GOAL_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
