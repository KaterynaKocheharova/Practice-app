import { authSessions } from '../schemas/schema';

export type CreateAuthSessionData = typeof authSessions.$inferInsert;
export type AuthSessionData = typeof authSessions.$inferSelect;
export type AuthSessionRefreshVerificationData = Pick<
  AuthSessionData,
  'hashedRefreshToken' | 'expiresAt' | 'revokedAt'
>;
