import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/modules/users/enums';
import type {
  GoogleOAuthState,
  GoogleSignInOAuthState,
  GoogleSignUpOAuthState,
  ParsedGoogleOAuthState,
} from '../../types';
import { GoogleOAuthFlow } from '../../enums';

@Injectable()
export class GoogleOAuthStateService {
  decode(rawState: string): GoogleOAuthState | undefined {
    try {
      const state = this.parse(rawState);

      if (!this.isGoogleOAuthState(state)) {
        return undefined;
      }

      return this.createGoogleOAuthState(state);
    } catch {
      return undefined;
    }
  }

  private parse(rawState: string): ParsedGoogleOAuthState {
    return JSON.parse(Buffer.from(rawState, 'base64url').toString('utf8'));
  }

  private isGoogleOAuthState(
    state: ParsedGoogleOAuthState,
  ): state is GoogleOAuthState {
    if (!this.hasValidGoogleOAuthStateBase(state)) {
      return false;
    }

    return state.flow === GoogleOAuthFlow.SignIn
      ? this.isGoogleSignInOAuthState(state)
      : this.isGoogleSignUpOAuthState(state);
  }

  private hasValidGoogleOAuthStateBase(
    state: ParsedGoogleOAuthState,
  ): state is ParsedGoogleOAuthState & {
    nonce: string;
    flow: GoogleOAuthFlow;
  } {
    return this.isStateNonce(state.nonce) && this.isGoogleOAuthFlow(state.flow);
  }

  private isGoogleSignInOAuthState(
    state: ParsedGoogleOAuthState & {
      nonce: string;
      flow: GoogleOAuthFlow;
    },
  ): state is GoogleSignInOAuthState {
    return state.flow === GoogleOAuthFlow.SignIn;
  }

  private isGoogleSignUpOAuthState(
    state: ParsedGoogleOAuthState & {
      nonce: string;
      flow: GoogleOAuthFlow;
    },
  ): state is GoogleSignUpOAuthState {
    return state.flow === GoogleOAuthFlow.SignUp && this.isUserRole(state.role);
  }

  private createGoogleOAuthState(state: GoogleOAuthState): GoogleOAuthState {
    if (state.flow === GoogleOAuthFlow.SignIn) {
      return {
        nonce: state.nonce,
        flow: state.flow,
      };
    }

    return {
      nonce: state.nonce,
      flow: state.flow,
      role: state.role,
    };
  }

  private isStateNonce(nonce: unknown): nonce is string {
    return typeof nonce === 'string' && nonce.length > 0;
  }

  private isGoogleOAuthFlow(flow: unknown): flow is GoogleOAuthFlow {
    return Object.values(GoogleOAuthFlow).includes(flow as GoogleOAuthFlow);
  }

  private isUserRole(role: unknown): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
  }
}
