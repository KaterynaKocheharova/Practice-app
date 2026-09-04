export const googleOauthConfigs = {
  scopes: ['openid', 'email', 'profile'],
  stateTtlMs: 10 * 60 * 1000,
  successPath: '/auth/google/success',
} as const;
