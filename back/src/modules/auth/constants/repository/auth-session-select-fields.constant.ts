import { authSessions } from '../../schemas/schema';

export const authSessionRefreshTokenSelectFields = {
  userId: authSessions.userId,
  hashedRefreshToken: authSessions.hashedRefreshToken,
  expiresAt: authSessions.expiresAt,
  revokedAt: authSessions.revokedAt,
};
