import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const AVAILABLE_COURSE_LANGUAGES_PATH =
  '/students/{studentId}/available-course-languages';

export const GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER = {
  SUMMARY: 'List languages available for a new course',
  DESCRIPTION:
    'Returns the languages in which the calling teacher can still create a course for the student. A teacher can have only one course per language with the same student, so languages they already teach are left out. Returns an empty array when every language is taken.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION:
    'Id of the student, who must be managed by the calling teacher.',
  OK_RESPONSE_DESCRIPTION:
    'Languages without a course from the calling teacher.',
  OK_RESPONSE_EXAMPLE: ['german', 'french', 'spanish'],
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id is not a valid UUID.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: AVAILABLE_COURSE_LANGUAGES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the calling user is not a teacher.',
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the student does not exist or is not managed by the calling teacher.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_NOT_FOUND,
    message: 'Student was not found.',
    path: AVAILABLE_COURSE_LANGUAGES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
