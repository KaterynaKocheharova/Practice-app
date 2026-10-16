export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload extends AuthTokenPayload {
  sessionId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}
