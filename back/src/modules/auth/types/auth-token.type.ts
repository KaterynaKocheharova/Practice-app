import { UserRole } from 'src/modules/users/enums/user-role.enum';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
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

export interface VerifySignupResponse {
  message: string;
}

export interface VerifySignupResult {
  response: VerifySignupResponse;
  tokens: AuthTokens;
}
