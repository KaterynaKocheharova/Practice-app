import type { AuthTokens } from './auth-token.type';
import { GoogleOAuthFlow } from '../enums';
import type { UserRole } from 'src/modules/users/enums';

export interface GoogleSignInOAuthState {
  nonce: string;
  flow: GoogleOAuthFlow.SignIn;
}

export interface GoogleSignUpOAuthState {
  nonce: string;
  flow: GoogleOAuthFlow.SignUp;
  role: UserRole;
}

export type GoogleOAuthState =
  | GoogleSignInOAuthState
  | GoogleSignUpOAuthState;

export type GoogleOAuthStartData =
  | {
      flow: GoogleOAuthFlow.SignIn;
    }
  | {
      flow: GoogleOAuthFlow.SignUp;
      role: UserRole;
    };

export interface ParsedGoogleOAuthState {
  nonce?: unknown;
  flow?: unknown;
  role?: unknown;
}

export interface ParsedGoogleOAuthStateWithFlow
  extends ParsedGoogleOAuthState {
  nonce: string;
  flow: GoogleOAuthFlow;
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
