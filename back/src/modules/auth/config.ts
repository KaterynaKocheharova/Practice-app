export const authConfig = {
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
    SUCCESS_PATH: '/auth/google/success',
  },
} as const;
