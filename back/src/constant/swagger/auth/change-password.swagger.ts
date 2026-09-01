import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_COOKIE_NAMES } from 'src/modules/auth/constants';

export const CHANGE_PASSWORD_SWAGGER = {
  SUMMARY: 'Change password',
  DESCRIPTION:
    'Changes the current local user password, revokes all refresh sessions, and clears auth cookies.',
  COOKIE_AUTH_NAME: AUTH_COOKIE_NAMES.ACCESS_TOKEN,
  REQUEST_BODY_DESCRIPTION:
    'Current password and a different new password for the authenticated local user.',
  NO_CONTENT_RESPONSE_DESCRIPTION:
    'Password changed successfully. Auth cookies were cleared and the response body is empty.',
  BODY: {
    CURRENT_PASSWORD: {
      EXAMPLE: 'StrongPass123',
      DESCRIPTION: 'Current account password.',
      MIN_LENGTH: 8,
      WRITE_ONLY: true,
    },
    NEW_PASSWORD: {
      EXAMPLE: 'StrongerPass456',
      DESCRIPTION:
        'New account password with at least 8 characters. Must differ from the current password.',
      MIN_LENGTH: 8,
      WRITE_ONLY: true,
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the new password is the same as the current password.',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.PASSWORDS_MUST_BE_DIFFERENT,
    message: 'New password must be different from current password.',
    path: '/auth/change-password',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing or invalid, the user cannot use local password auth, or the current password is invalid.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_CREDENTIALS,
    message: 'Invalid email or password.',
    path: '/auth/change-password',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
