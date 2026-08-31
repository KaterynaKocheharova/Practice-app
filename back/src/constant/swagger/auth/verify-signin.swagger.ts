import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';

export const VERIFY_SIGNIN_SWAGGER = {
  SUMMARY: 'Verify sign-in',
  DESCRIPTION:
    'Verifies a sign-in token for an active user, creates a refresh session, and sets auth cookies.',
  REQUEST_BODY_DESCRIPTION: 'Sign-in verification token.',
  OK_RESPONSE_DESCRIPTION: AUTH_RESPONSE.SIGN_IN_VERIFIED_MESSAGE,
  OK_RESPONSE_EXAMPLE: {
    message: AUTH_RESPONSE.SIGN_IN_VERIFIED_MESSAGE,
  },
  BODY: {
    TOKEN: {
      EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      DESCRIPTION: 'JWT token from the sign-in verification email.',
      MIN_LENGTH: 32,
    },
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the sign-in verification token is invalid or expired.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_SIGNIN_VERIFICATION_TOKEN,
    message: 'Invalid sign-in verification token.',
    path: '/auth/verify-signin',
    timestamp: '2026-08-31T00:00:00.000Z',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when sign-in verification is not allowed for the user.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.SIGNIN_VERIFICATION_NOT_ALLOWED,
    message: 'Sign-in verification is not allowed for this user.',
    path: '/auth/verify-signin',
    timestamp: '2026-08-31T00:00:00.000Z',
  },
} as const;
