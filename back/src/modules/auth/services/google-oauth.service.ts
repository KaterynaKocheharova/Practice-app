import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import {
  ERROR_CODE,
  type ErrorCode,
} from 'src/common/constants/errors/error-code.constant';
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
  private readonly logger = new Logger(GoogleOAuthService.name);

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

  /**
   * Never throws: the browser is mid-redirect, so failures go back to the
   * frontend as an error code instead of a JSON page on the backend domain.
   */
  async handleCallback(
    params: GoogleOAuthCallbackParams,
  ): Promise<GoogleOAuthCallbackResult> {
    try {
      const code = await this.completeCallback(params);

      return {
        redirectUrl: this.createCallbackRedirectUrl(
          authConfig.GOOGLE_OAUTH.EXCHANGE_CODE_QUERY_PARAM,
          code,
        ),
      };
    } catch (error) {
      const errorCode = this.toForwardedErrorCode(error);

      if (errorCode === ERROR_CODE.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          'Google OAuth callback failed',
          error instanceof Error ? error.stack : undefined,
        );
      } else {
        this.logger.warn(`Google OAuth callback rejected: ${errorCode}`);
      }

      return {
        redirectUrl: this.createCallbackRedirectUrl(
          authConfig.GOOGLE_OAUTH.ERROR_QUERY_PARAM,
          errorCode,
        ),
      };
    }
  }

  private async completeCallback(
    params: GoogleOAuthCallbackParams,
  ): Promise<string> {
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

    return this.googleOAuthExchangeCodeService.create(user.id);
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

  private createCallbackRedirectUrl(param: string, value: string): string {
    const { frontendUrl } = getAuthEnvConfig(this.configService);
    const url = new URL(authConfig.GOOGLE_OAUTH.CALLBACK_PATH, frontendUrl);

    url.searchParams.set(param, value);

    return url.toString();
  }

  private toForwardedErrorCode(error: unknown): ErrorCode {
    const response =
      error instanceof HttpException ? error.getResponse() : undefined;
    const errorCode =
      typeof response === 'object' &&
      response !== null &&
      'errorCode' in response
        ? response.errorCode
        : undefined;
    const forwardedCodes: readonly ErrorCode[] =
      authConfig.GOOGLE_OAUTH.FORWARDED_ERROR_CODES;

    return (
      forwardedCodes.find((code) => code === errorCode) ??
      ERROR_CODE.INTERNAL_SERVER_ERROR
    );
  }

  private createInvalidCodeException(): BadRequestException {
    return new BadRequestException({
      errorCode: ERROR_CODE.INVALID_GOOGLE_OAUTH_CODE,
    });
  }
}
