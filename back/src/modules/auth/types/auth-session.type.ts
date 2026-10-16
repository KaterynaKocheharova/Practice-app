import { authSessions } from '../schemas/schema';
import type { AuthTokens, RefreshTokenPayload } from './auth-token.type';

export type CreateAuthSessionData = typeof authSessions.$inferInsert;
export type AuthSessionData = typeof authSessions.$inferSelect;
export type AuthSessionRefreshTokenData = Pick<
  AuthSessionData,
  'userId' | 'hashedRefreshToken' | 'expiresAt' | 'revokedAt' | 'replacedBy'
>;

/** Successor tokens kept for the refresh grace window (dates as ISO strings). */
export interface RefreshGraceEntry {
  userAgentHash: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthSessionUserData {
  id: string;
  email: string;
}

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
