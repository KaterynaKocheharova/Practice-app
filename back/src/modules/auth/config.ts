export const authConfig = {
  HEADERS: {
    USER_AGENT: 'user-agent',
  },
  COOKIES: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    GOOGLE_OAUTH_STATE: 'googleOAuthState',
  },
  JOBS: {
    SEND_SIGNIN_VERIFICATION: 'send-signin-verification',
    SEND_SIGNUP_VERIFICATION: 'send-signup-verification',
    CLEANUP_EXPIRED_VERIFICATION_LINKS: 'cleanup-expired-verification-links',
  },
  QUEUES: {
    EMAIL: 'auth-email',
    MAINTENANCE: 'auth-maintenance',
  },
  VERIFICATION_CLEANUP: {
    EVERY_MS: 60 * 60 * 1000,
    JOB_ID: 'auth-verification-links-cleanup',
  },
  GOOGLE_OAUTH: {
    SCOPES: ['openid', 'email', 'profile'],
    STATE_TTL_MS: 10 * 60 * 1000,
    CALLBACK_PATH: '/auth/google/callback',
    EXCHANGE_CODE_QUERY_PARAM: 'code',
    EXCHANGE_CODE_TTL_MS: 60 * 1000,
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
