import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';
import { UserRole } from 'src/modules/users/enums';

const ONBOARDING_PATH = '/onboarding';

export const COMPLETE_ONBOARDING_SWAGGER = {
  SUMMARY: 'Complete onboarding',
  DESCRIPTION:
    'Sets the name and role of the calling user and activates the account. Students may also send their profile details. Can be completed only once.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  REQUEST_BODY_DESCRIPTION:
    'User name and role, with optional student profile details when the role is student.',
  NO_CONTENT_RESPONSE_DESCRIPTION: 'Onboarding completed. No response body.',
  BODY: {
    NAME: {
      EXAMPLE: 'Anna Kovalenko',
      DESCRIPTION: 'User full name.',
    },
    ROLE: {
      EXAMPLE: UserRole.Student,
      DESCRIPTION: 'Role the user picks for the account.',
    },
    STUDENT: {
      DESCRIPTION: `Optional student profile details. Allowed only when role is ${UserRole.Student}.`,
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the request body is invalid, including student details sent with a non-student role.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is neither onboarding nor active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: ONBOARDING_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when the user has already completed onboarding.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.ONBOARDING_ALREADY_COMPLETED,
    message: 'Your profile is already set up.',
    path: ONBOARDING_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
