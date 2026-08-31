import { authSessions } from '../../schemas/schema';

export const authSessionRefreshVerificationSelectFields = {
  hashedRefreshToken: authSessions.hashedRefreshToken,
  expiresAt: authSessions.expiresAt,
  revokedAt: authSessions.revokedAt,
};
