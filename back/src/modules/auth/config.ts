import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';

export const authConfig = {
  HEADERS: {
    USER_AGENT: 'user-agent',
  },
  COOKIES: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    GOOGLE_OAUTH_STATE: 'googleOAuthState',
  },
  GOOGLE_OAUTH: {
    SCOPES: ['openid', 'email', 'profile'],
    STATE_TTL_MS: 10 * 60 * 1000,
    CALLBACK_PATH: '/auth/google/callback',
    EXCHANGE_CODE_QUERY_PARAM: 'code',
    EXCHANGE_CODE_TTL_MS: 60 * 1000,
    ERROR_QUERY_PARAM: 'error',
    FORWARDED_ERROR_CODES: [
      ERROR_CODE.INVALID_GOOGLE_OAUTH_STATE,
      ERROR_CODE.INVALID_GOOGLE_OAUTH_CODE,
      ERROR_CODE.GOOGLE_EMAIL_NOT_VERIFIED,
      ERROR_CODE.GOOGLE_ACCOUNT_NOT_FOUND,
      ERROR_CODE.GOOGLE_ACCOUNT_CONFLICT,
      ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
    ],
  },
  REFRESH_GRACE: {
    TTL_MS: 10 * 1000,
  },
  REDIS_KEYS: {
    GOOGLE_OAUTH_EXCHANGE_CODE: 'auth:google-oauth-exchange-code:',
    REFRESH_GRACE: 'auth:refresh-grace:',
  },
  RATE_LIMIT: {
    SENSITIVE: {
      TTL_MS: 60 * 1000,
      LIMIT: 5,
    },
  },
} as const;
