import { authSessions } from '../schemas/schema';
import type { AuthTokens, RefreshTokenPayload } from './auth-token.type';

export type CreateAuthSessionData = typeof authSessions.$inferInsert;
export type AuthSessionData = typeof authSessions.$inferSelect;
export type AuthSessionRefreshTokenData = Pick<
  AuthSessionData,
  'userId' | 'hashedRefreshToken' | 'expiresAt' | 'revokedAt'
>;

export interface AuthSessionTokensResult {
  sessionId: string;
  tokens: AuthTokens;
}

export interface RefreshTokenSessionVerificationResult {
  payload: RefreshTokenPayload;
  session: {
    id: string;
    userId: string;
  };
}
