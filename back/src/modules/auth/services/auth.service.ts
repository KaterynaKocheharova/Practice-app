import { Injectable } from '@nestjs/common';
import type { AuthTokens } from '../types/auth-token.type';
import type {
  GoogleOAuthCallbackParams,
  GoogleOAuthCallbackResult,
  GoogleOAuthStartResult,
} from '../types/google-oauth.type';
import type { LogoutTokens } from '../types/logout.type';
import { GoogleOAuthService } from './google-oauth.service';
import { LogoutService } from './logout.service';
import { RefreshService } from './refresh.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshService: RefreshService,
    private readonly logoutService: LogoutService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  async refresh(
    refreshToken: string,
    userAgent: string | undefined,
  ): Promise<AuthTokens> {
    return this.refreshService.refresh(refreshToken, userAgent);
  }

  async logout(tokens: LogoutTokens): Promise<void> {
    return this.logoutService.logout(tokens);
  }

  createGoogleAuthorizationUrl(): GoogleOAuthStartResult {
    return this.googleOAuthService.createAuthorizationUrl();
  }

  handleGoogleCallback(
    params: GoogleOAuthCallbackParams,
  ): Promise<GoogleOAuthCallbackResult> {
    return this.googleOAuthService.handleCallback(params);
  }

  exchangeGoogleOAuthCode(code: string): Promise<AuthTokens> {
    return this.googleOAuthService.exchangeCode(code);
  }
}
