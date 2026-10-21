import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const STUDENT_PATH = '/students/{studentId}';

export const UPDATE_STUDENT_SWAGGER = {
  SUMMARY: 'Update student',
  DESCRIPTION:
    'Partially updates a student. While the student is managed, only the teacher who created them can edit them. Once the student has their own account, only the student can edit themselves, and not their email.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  REQUEST_BODY_DESCRIPTION:
    'Send only the fields to change, at least one. `null` clears an optional field; `name` cannot be cleared.',
  NULLABLE_FIELD_DESCRIPTION: 'Send `null` to clear it.',
  OK_RESPONSE_DESCRIPTION: 'Student updated. Returns the id of the student.',
  OK_RESPONSE_EXAMPLE: {
    id: '3f1c2b7e-8a4d-4c9e-9b21-6d5e7f8a9b0c',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id is not a valid UUID, the body is invalid or has unknown fields, or the body changes nothing.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.EMPTY_UPDATE_BODY,
    message: 'Nothing to update.',
    path: STUDENT_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: STUDENT_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the student does not exist or the caller may not edit them now: anyone but the student or their creating teacher, the creating teacher once the student has their own account, or the student while still managed.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_NOT_FOUND,
    message: 'Student was not found.',
    path: STUDENT_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when the teacher sets an email that another user already has.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
    message: 'User with this email already exists.',
    path: STUDENT_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
