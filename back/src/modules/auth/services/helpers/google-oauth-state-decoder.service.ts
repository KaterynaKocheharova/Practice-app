import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { UserRole } from 'src/modules/users/enums';
import { GoogleOAuthFlow } from '../../enums';
import type {
  GoogleOAuthState,
  GoogleSignInOAuthState,
  GoogleSignUpOAuthState,
  ParsedGoogleOAuthState,
  ParsedGoogleOAuthStateWithFlow,
} from '../../types';

@Injectable()
export class GoogleOAuthStateDecoderService {
  constructor(private readonly configService: ConfigService) {}

  decode(rawState: string): GoogleOAuthState | undefined {
    try {
      const payload = this.verifySignatureAndExtractPayload(rawState);

      if (!payload) {
        return undefined;
      }

      const state = this.parse(payload);

      if (!this.isGoogleOAuthState(state)) {
        return undefined;
      }

      return this.createGoogleOAuthState(state);
    } catch {
      return undefined;
    }
  }

  private verifySignatureAndExtractPayload(
    rawState: string,
  ): string | undefined {
    const [payload, signature] = rawState.split('.');

    if (!payload || !signature || !this.isSignatureValid(payload, signature)) {
      return undefined;
    }

    return payload;
  }

  private isSignatureValid(payload: string, signature: string): boolean {
    const { googleOAuthStateSecret } = getAuthEnvConfig(this.configService);
    const expectedSignature = createHmac('sha256', googleOAuthStateSecret)
      .update(payload)
      .digest();
    const providedSignature = Buffer.from(signature, 'base64url');

    return (
      providedSignature.length === expectedSignature.length &&
      timingSafeEqual(providedSignature, expectedSignature)
    );
  }

  private parse(payload: string): ParsedGoogleOAuthState {
    return JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as ParsedGoogleOAuthState;
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
  ): state is ParsedGoogleOAuthStateWithFlow {
    return this.isStateNonce(state.nonce) && this.isGoogleOAuthFlow(state.flow);
  }

  private isGoogleSignInOAuthState(
    state: ParsedGoogleOAuthStateWithFlow,
  ): state is GoogleSignInOAuthState {
    return state.flow === GoogleOAuthFlow.SignIn;
  }

  private isGoogleSignUpOAuthState(
    state: ParsedGoogleOAuthStateWithFlow,
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

  private isGoogleOAuthFlow(flow: unknown): boolean {
    return Object.values(GoogleOAuthFlow).includes(flow as GoogleOAuthFlow);
  }

  private isUserRole(role: unknown): boolean {
    return Object.values(UserRole).includes(role as UserRole);
  }
}
