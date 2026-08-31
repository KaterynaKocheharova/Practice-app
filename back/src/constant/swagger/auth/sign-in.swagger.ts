import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';

export const SIGN_IN_SWAGGER = {
  SUMMARY: 'Create a sign-in request',
  DESCRIPTION:
    'Verifies local user credentials for an active account, then queues a sign-in verification email.',
  REQUEST_BODY_DESCRIPTION: 'Email and password for the sign-in request.',
  ACCEPTED_RESPONSE_DESCRIPTION: AUTH_RESPONSE.SIGN_IN_ACCEPTED_MESSAGE,
  ACCEPTED_RESPONSE_EXAMPLE: {
    message: AUTH_RESPONSE.SIGN_IN_ACCEPTED_MESSAGE,
    email: 'user@example.com',
  },
  BODY: {
    EMAIL: {
      EXAMPLE: 'user@example.com',
      DESCRIPTION: 'Email address for the local active account.',
      FORMAT: 'email',
    },
    PASSWORD: {
      EXAMPLE: 'StrongPass123',
      DESCRIPTION: 'Account password with at least 8 characters.',
      MIN_LENGTH: 8,
      WRITE_ONLY: true,
    },
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when credentials are invalid or the account cannot use local sign-in.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_CREDENTIALS,
    message: 'Invalid email or password.',
    path: '/auth/sign-in',
    timestamp: '2026-08-31T00:00:00.000Z',
  },
} as const;
