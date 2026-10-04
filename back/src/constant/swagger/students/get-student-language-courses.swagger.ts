import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const COURSES_PATH = '/students/{studentId}/courses';

export const GET_STUDENT_LANGUAGE_COURSES_SWAGGER = {
  SUMMARY: 'List student language courses',
  DESCRIPTION:
    "Returns the student's language courses, newest first. The student sees all their courses; a teacher sees only the courses they teach to this student.",
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  OK_RESPONSE_DESCRIPTION: 'Course cards.',
  OK_RESPONSE_EXAMPLE: [
    {
      id: '9b8a7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
      language: 'english',
      learningGoal: 'conversation',
    },
  ],
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id is not a valid UUID.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: COURSES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the student does not exist or the caller may not access it.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_NOT_FOUND,
    message: 'Student was not found.',
    path: COURSES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
