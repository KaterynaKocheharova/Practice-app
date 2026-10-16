import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { normalizeEmail } from 'src/common/helpers';
import { UserStatus } from 'src/modules/users/enums';
import { hasEmail, isSessionAllowedStatus } from 'src/modules/users/helpers';
import { UsersService } from 'src/modules/users/services/users.service';
import type {
  UserAuthSessionData,
  UserGoogleLinkData,
} from 'src/modules/users/types';
import type {
  AuthTokens,
  GoogleOAuthCallbackParams,
  GoogleOAuthCallbackResult,
  GoogleOAuthProfile,
  GoogleOAuthStartResult,
} from '../types';
import { authConfig } from '../config';
import { AuthSessionService } from './auth-session.service';
import { GoogleOAuthExchangeCodeService } from './helpers/google-oauth-exchange-code.service';

@Injectable()
export class GoogleOAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authSessionService: AuthSessionService,
    private readonly googleOAuthExchangeCodeService: GoogleOAuthExchangeCodeService,
  ) {}

  createAuthorizationUrl(): GoogleOAuthStartResult {
    const stateNonce = this.createStateNonce();
    const authorizationUrl = this.createClient().generateAuthUrl({
      access_type: 'online',
      include_granted_scopes: true,
      prompt: 'select_account',
      scope: [...authConfig.GOOGLE_OAUTH.SCOPES],
      state: stateNonce,
    });

    return {
      authorizationUrl,
      stateNonce,
      stateExpiresAt: new Date(
        Date.now() + authConfig.GOOGLE_OAUTH.STATE_TTL_MS,
      ),
    };
  }

  async handleCallback(
    params: GoogleOAuthCallbackParams,
  ): Promise<GoogleOAuthCallbackResult> {
    if (!this.isStateValid(params.state, params.stateNonce)) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.INVALID_GOOGLE_OAUTH_STATE,
      });
    }

    const profile = await this.getGoogleProfile(params.code, params.error);
    const user = await this.findOrCreateGoogleUser(profile);

    if (!hasEmail(user)) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.GOOGLE_ACCOUNT_NOT_FOUND,
      });
    }

    const code = await this.googleOAuthExchangeCodeService.create(user.id);

    return {
      redirectUrl: this.createCallbackRedirectUrl(code),
    };
  }

  async exchangeCode(code: string): Promise<AuthTokens> {
    const userId = await this.googleOAuthExchangeCodeService.consume(code);
    const user = userId
      ? await this.usersService.getUserSessionStatusById(userId)
      : undefined;

    if (!user || !isSessionAllowedStatus(user.status) || !hasEmail(user)) {
      throw this.createInvalidCodeException();
    }

    const { tokens } = await this.authSessionService.createSessionTokens(user);

    return tokens;
  }

  private isStateValid(
    state: string | undefined,
    expectedNonce: string | undefined,
  ): boolean {
    if (!state || !expectedNonce) {
      return false;
    }

    const stateBuffer = Buffer.from(state);
    const nonceBuffer = Buffer.from(expectedNonce);

    return (
      stateBuffer.length === nonceBuffer.length &&
      timingSafeEqual(stateBuffer, nonceBuffer)
    );
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
      email: normalizeEmail(payload.email),
      emailVerified: payload.email_verified,
      name: this.createDisplayName(payload),
      avatarUrl: payload.picture,
    };
  }

  private async findOrCreateGoogleUser(
    profile: GoogleOAuthProfile,
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

    return this.usersService.createGoogleAuthUser({
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      googleId: profile.googleId,
      status: UserStatus.Onboarding,
    });
  }

  private updateGoogleUserProfile(
    userId: string,
    profile: GoogleOAuthProfile,
  ): Promise<UserAuthSessionData> {
    return this.usersService.updateGoogleAuthUserById(userId, {
      avatarUrl: profile.avatarUrl ?? null,
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

    if (user.status === UserStatus.Managed) {
      throw new ConflictException({
        errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
      });
    }

    return this.usersService.updateGoogleAuthUserById(user.id, {
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

  private createCallbackRedirectUrl(code: string): string {
    const { frontendUrl } = getAuthEnvConfig(this.configService);
    const url = new URL(authConfig.GOOGLE_OAUTH.CALLBACK_PATH, frontendUrl);

    url.searchParams.set(
      authConfig.GOOGLE_OAUTH.EXCHANGE_CODE_QUERY_PARAM,
      code,
    );

    return url.toString();
  }

  private createInvalidCodeException(): BadRequestException {
    return new BadRequestException({
      errorCode: ERROR_CODE.INVALID_GOOGLE_OAUTH_CODE,
    });
  }
}
