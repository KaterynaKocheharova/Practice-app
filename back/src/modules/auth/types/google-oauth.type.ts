import type { AuthTokens } from './auth-token.type';
import type { UserRole } from 'src/modules/users/enums';

export interface GoogleOAuthState {
  nonce: string;
  role: UserRole;
}

export interface GoogleOAuthStartResult {
  authorizationUrl: string;
  stateNonce: string;
  stateExpiresAt: Date;
}

export interface GoogleOAuthProfile {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl?: string;
}

export interface GoogleOAuthCallbackParams {
  code?: string;
  error?: string;
  state?: string;
  stateNonce?: string;
}

export interface GoogleOAuthCallbackResult {
  tokens: AuthTokens;
  redirectUrl: string;
}
