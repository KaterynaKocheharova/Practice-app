import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const STUDENT_PATH = '/students/{studentId}';

export const GET_STUDENT_BY_ID_SWAGGER = {
  SUMMARY: 'Get student details',
  DESCRIPTION:
    'Returns the details of a student. Available to the student themselves, or to a teacher the student belongs to (created them or teaches them a course).',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  OK_RESPONSE_DESCRIPTION: 'Student details.',
  OK_RESPONSE_EXAMPLE: {
    id: '3f1c2b7e-8a4d-4c9e-9b21-6d5e7f8a9b0c',
    name: 'Anna Kovalenko',
    email: 'anna@example.com',
    birthDate: '1995-04-12',
    job: 'Software engineer',
    hobbies: ['reading', 'hiking'],
    status: 'managed',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id is not a valid UUID.',
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
    'Returned when the student does not exist or the caller may not access it.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_NOT_FOUND,
    message: 'Student was not found.',
    path: STUDENT_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
