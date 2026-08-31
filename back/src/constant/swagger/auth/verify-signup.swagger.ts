import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';

export const VERIFY_SIGNUP_SWAGGER = {
  SUMMARY: 'Verify sign-up',
  DESCRIPTION:
    'Verifies a sign-up token, activates the user when needed, creates a refresh session, and sets auth cookies.',
  REQUEST_BODY_DESCRIPTION: 'Sign-up verification token.',
  OK_RESPONSE_DESCRIPTION: AUTH_RESPONSE.SIGN_UP_VERIFIED_MESSAGE,
  OK_RESPONSE_EXAMPLE: {
    message: AUTH_RESPONSE.SIGN_UP_VERIFIED_MESSAGE,
  },
  BODY: {
    TOKEN: {
      EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      DESCRIPTION: 'JWT token from the sign-up verification email.',
      MIN_LENGTH: 32,
    },
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the sign-up verification token is invalid or expired.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_SIGNUP_VERIFICATION_TOKEN,
    message: 'Invalid sign-up verification token.',
    path: '/auth/verify-signup',
    timestamp: '2026-08-31T00:00:00.000Z',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when sign-up verification is not allowed for the user.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.SIGNUP_VERIFICATION_NOT_ALLOWED,
    message: 'Sign-up verification is not allowed for this user.',
    path: '/auth/verify-signup',
    timestamp: '2026-08-31T00:00:00.000Z',
  },
} as const;
