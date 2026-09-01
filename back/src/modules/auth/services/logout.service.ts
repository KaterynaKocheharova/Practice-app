import { Injectable } from '@nestjs/common';
import type { LogoutTokens } from '../types';
import { AuthSessionService } from './auth-session.service';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class LogoutService {
  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async logout(tokens: LogoutTokens): Promise<void> {
    const userId = await this.getUserIdFromTokens(tokens);

    if (!userId) {
      return;
    }

    await this.authSessionService.revokeSessionsByUserId(userId);
  }

  private async getUserIdFromTokens(
    tokens: LogoutTokens,
  ): Promise<string | undefined> {
    return (
      (await this.getUserIdFromRefreshToken(tokens.refreshToken)) ??
      (await this.getUserIdFromAccessToken(tokens.accessToken))
    );
  }

  private async getUserIdFromRefreshToken(
    refreshToken?: string,
  ): Promise<string | undefined> {
    if (!refreshToken) {
      return undefined;
    }

    try {
      const payload =
        await this.authTokenService.verifyRefreshToken(refreshToken);
      const { session } =
        await this.authSessionService.verifyRefreshTokenSession(
          refreshToken,
          payload,
        );

      return session.userId;
    } catch {
      return undefined;
    }
  }

  private async getUserIdFromAccessToken(
    accessToken?: string,
  ): Promise<string | undefined> {
    if (!accessToken) {
      return undefined;
    }

    try {
      const payload =
        await this.authTokenService.verifyAccessToken(accessToken);

      return payload.sub;
    } catch {
      return undefined;
    }
  }
}
