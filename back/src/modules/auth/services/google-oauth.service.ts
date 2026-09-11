import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { randomBytes } from 'node:crypto';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserRole } from 'src/modules/users/enums';
import { UserAuthProvider } from 'src/modules/users/enums/user-auth-provider.enum';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { UsersService } from 'src/modules/users/services/users.service';
import type {
  UserAuthSessionData,
  UserGoogleLinkData,
} from 'src/modules/users/types';
import type {
  GoogleOAuthCallbackParams,
  GoogleOAuthCallbackResult,
  GoogleOAuthProfile,
  GoogleOAuthStartData,
  GoogleOAuthStartResult,
  GoogleOAuthState,
} from '../types';
import { GoogleOAuthFlow } from '../enums';
import { authConfig } from '../config';
import { AuthSessionService } from './auth-session.service';
import { GoogleOAuthStateService } from './helpers/google-oauth-state.service';

@Injectable()
export class GoogleOAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authSessionService: AuthSessionService,
    private readonly googleOAuthStateService: GoogleOAuthStateService,
  ) {}

  createSignInAuthorizationUrl(): GoogleOAuthStartResult {
    return this.createAuthorizationUrl({
      flow: GoogleOAuthFlow.SignIn,
    });
  }

  createSignUpAuthorizationUrl(role: UserRole): GoogleOAuthStartResult {
    return this.createAuthorizationUrl({
      flow: GoogleOAuthFlow.SignUp,
      role,
    });
  }

  private createAuthorizationUrl(
    data: GoogleOAuthStartData,
  ): GoogleOAuthStartResult {
    const stateNonce = this.createStateNonce();
    const state = this.googleOAuthStateService.encode({
      nonce: stateNonce,
      ...data,
    });
    const authorizationUrl = this.createClient().generateAuthUrl({
      access_type: 'online',
      include_granted_scopes: true,
      prompt: 'select_account',
      scope: [...authConfig.GOOGLE_OAUTH.SCOPES],
      state,
    });

    return {
      authorizationUrl,
      stateNonce,
      stateExpiresAt: new Date(Date.now() + authConfig.GOOGLE_OAUTH.STATE_TTL_MS),
    };
  }

  async handleCallback(
    params: GoogleOAuthCallbackParams,
  ): Promise<GoogleOAuthCallbackResult> {
    const state = this.verifyState(params.state, params.stateNonce);
    const profile = await this.getGoogleProfile(params.code, params.error);
    const user = await this.findOrCreateGoogleUser(profile, state);
    const { tokens } = await this.authSessionService.createSessionTokens(user);

    return {
      tokens,
      redirectUrl: this.createSuccessRedirectUrl(),
    };
  }

  private verifyState(
    rawState: string | undefined,
    expectedNonce: string | undefined,
  ): GoogleOAuthState {
    if (!rawState || !expectedNonce) {
      throw this.createInvalidStateException();
    }

    const state = this.googleOAuthStateService.decode(rawState);

    if (!state || state.nonce !== expectedNonce) {
      throw this.createInvalidStateException();
    }

    return state;
  }

  private async getGoogleProfile(
    code: string | undefined,
    googleError: string | undefined,
  ): Promise<GoogleOAuthProfile> {
    if (!code || googleError) {
      throw this.createInvalidCodeException();
    }

    const client = this.createClient();
    const idToken = await this.exchangeCodeForIdToken(client, code);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: getAuthEnvConfig(this.configService).googleOAuthClientId,
    });
    const payload = ticket.getPayload();

    return this.createProfile(payload);
  }

  private async exchangeCodeForIdToken(
    client: OAuth2Client,
    code: string,
  ): Promise<string> {
    try {
      const { tokens } = await client.getToken(code);

      if (!tokens.id_token) {
        throw this.createInvalidCodeException();
      }

      return tokens.id_token;
    } catch {
      throw this.createInvalidCodeException();
    }
  }

  private createProfile(payload: TokenPayload | undefined): GoogleOAuthProfile {
    if (!payload?.sub || !payload.email) {
      throw this.createInvalidCodeException();
    }

    if (!payload.email_verified) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.GOOGLE_EMAIL_NOT_VERIFIED,
      });
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: this.createDisplayName(payload),
      avatarUrl: payload.picture,
    };
  }

  private async findOrCreateGoogleUser(
    profile: GoogleOAuthProfile,
    state: GoogleOAuthState,
  ): Promise<UserAuthSessionData> {
    const userIdByGoogleId = await this.usersService.getUserIdByGoogleId(
      profile.googleId,
    );

    if (userIdByGoogleId) {
      return this.updateGoogleUserProfile(userIdByGoogleId, profile);
    }

    const googleLinkData = await this.usersService.getGoogleLinkDataByEmail(
      profile.email,
    );

    if (googleLinkData) {
      return this.linkGoogleProfile(googleLinkData, profile);
    }

    if (state.flow === GoogleOAuthFlow.SignIn) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.GOOGLE_ACCOUNT_NOT_FOUND,
      });
    }

    return this.usersService.createGoogleAuthUser({
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      role: state.role,
      googleId: profile.googleId,
      authProvider: UserAuthProvider.Google,
      status: UserStatus.Active,
    });
  }

  private updateGoogleUserProfile(
    userId: string,
    profile: GoogleOAuthProfile,
  ): Promise<UserAuthSessionData> {
    return this.usersService.updateGoogleAuthUserById(userId, {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      status: UserStatus.Active,
    });
  }

  private linkGoogleProfile(
    user: UserGoogleLinkData,
    profile: GoogleOAuthProfile,
  ): Promise<UserAuthSessionData> {
    if (user.googleId && user.googleId !== profile.googleId) {
      throw new ConflictException({
        errorCode: ERROR_CODE.GOOGLE_ACCOUNT_CONFLICT,
      });
    }

    return this.usersService.updateGoogleAuthUserById(user.id, {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      googleId: profile.googleId,
      status: UserStatus.Active,
    });
  }

  private createClient(): OAuth2Client {
    const {
      googleOAuthClientId,
      googleOAuthClientSecret,
      googleOAuthRedirectUri,
    } = getAuthEnvConfig(this.configService);

    return new OAuth2Client({
      clientId: googleOAuthClientId,
      clientSecret: googleOAuthClientSecret,
      redirectUri: googleOAuthRedirectUri,
    });
  }

  private createStateNonce(): string {
    return randomBytes(32).toString('base64url');
  }

  private createDisplayName(payload: TokenPayload): string {
    return payload.name?.trim() || payload.email?.split('@')[0] || payload.sub;
  }

  private createSuccessRedirectUrl(): string {
    const { frontendUrl } = getAuthEnvConfig(this.configService);

    return new URL(authConfig.GOOGLE_OAUTH.SUCCESS_PATH, frontendUrl).toString();
  }

  private createInvalidStateException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_GOOGLE_OAUTH_STATE,
    });
  }

  private createInvalidCodeException(): BadRequestException {
    return new BadRequestException({
      errorCode: ERROR_CODE.INVALID_GOOGLE_OAUTH_CODE,
    });
  }
}
