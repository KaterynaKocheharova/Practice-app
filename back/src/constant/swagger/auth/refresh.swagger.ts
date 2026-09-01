import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_COOKIE_NAMES } from 'src/modules/auth/constants';

export const REFRESH_SWAGGER = {
  SUMMARY: 'Refresh auth tokens',
  DESCRIPTION:
    'Uses the refresh token cookie to rotate the refresh session, revoke the previous session, and set new auth cookies.',
  COOKIE_AUTH_NAME: AUTH_COOKIE_NAMES.REFRESH_TOKEN,
  NO_CONTENT_RESPONSE_DESCRIPTION:
    'Auth cookies were refreshed successfully. The response body is empty.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the refresh token cookie is missing, invalid, expired, revoked, reused, or belongs to an inactive or missing user.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
    message: 'Invalid refresh token.',
    path: '/auth/refresh',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
