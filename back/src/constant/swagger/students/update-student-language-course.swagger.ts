import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const COURSE_PATH = '/students/{studentId}/courses/{courseId}';

export const UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER = {
  SUMMARY: 'Update student language course',
  DESCRIPTION:
    'Partially updates a language course taught by the calling teacher. The language cannot be changed.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  COURSE_ID_DESCRIPTION: 'Id of the course.',
  REQUEST_BODY_DESCRIPTION:
    'Send only the fields to change, at least one. `null` clears a field, except `learningGoals`, which cannot be cleared.',
  NULLABLE_FIELD_DESCRIPTION: 'Send `null` to clear it.',
  LEARNING_GOALS_REPLACE_DESCRIPTION:
    'Replaces the whole goal set. `null` and an empty array are rejected.',
  OK_RESPONSE_DESCRIPTION: 'Course updated. Returns the id of the course.',
  OK_RESPONSE_EXAMPLE: {
    id: '9b8a7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when an id is not a valid UUID, the body is invalid or has unknown fields (including `language`), or the body changes nothing.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.EMPTY_UPDATE_BODY,
    message: 'Nothing to update.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the calling user is not a teacher.',
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the course does not exist, does not belong to the student, or is not taught by the calling teacher.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
    message: 'Course was not found.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
