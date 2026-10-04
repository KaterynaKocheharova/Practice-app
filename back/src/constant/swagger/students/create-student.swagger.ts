import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

export const CREATE_STUDENT_SWAGGER = {
  SUMMARY: 'Create student',
  DESCRIPTION:
    'Creates a managed student account and its student profile. Any logged-in user can call this endpoint. When the caller is a teacher, the student is linked to that teacher (createdByTeacherId); otherwise the student is created without a creating teacher.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  REQUEST_BODY_DESCRIPTION:
    'Student name, with optional email, birth date, job and hobbies.',
  CREATED_RESPONSE_DESCRIPTION:
    'Student created. Returns the id of the new student.',
  CREATED_RESPONSE_EXAMPLE: {
    id: '3f1c2b7e-8a4d-4c9e-9b21-6d5e7f8a9b0c',
  },
  BODY: {
    NAME: {
      EXAMPLE: 'Anna Kovalenko',
      DESCRIPTION: 'Student full name.',
    },
    EMAIL: {
      EXAMPLE: 'anna@example.com',
      DESCRIPTION: 'Optional email. Must not belong to an existing user.',
    },
    BIRTH_DATE: {
      EXAMPLE: '2000-05-17',
      DESCRIPTION: 'Optional birth date in ISO 8601 format (YYYY-MM-DD).',
    },
    JOB: {
      EXAMPLE: 'Software engineer',
      DESCRIPTION: 'Optional occupation.',
    },
    HOBBIES: {
      EXAMPLE: ['reading', 'cycling'],
      DESCRIPTION: 'Optional list of hobbies.',
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the request body is invalid, or when the caller is a teacher whose teacher profile was not found.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.TEACHER_NOT_FOUND,
    message: 'Teacher was not found.',
    path: '/students',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: '/students',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when a user with the given email already exists.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
    message: 'User with this email already exists.',
    path: '/students',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
