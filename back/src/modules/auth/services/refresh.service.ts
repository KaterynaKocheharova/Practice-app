import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserStatus } from 'src/modules/users/enums';
import { hasEmail } from 'src/modules/users/helpers';
import { UsersService } from 'src/modules/users/services/users.service';
import type { AuthTokens } from '../types';
import { AuthSessionService } from './auth-session.service';
import { AuthTokenService } from './auth-token.service';
import { RefreshGraceService } from './helpers/refresh-grace.service';

@Injectable()
export class RefreshService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authTokenService: AuthTokenService,
    private readonly authSessionService: AuthSessionService,
    private readonly refreshGraceService: RefreshGraceService,
  ) {}

  async refresh(
    refreshToken: string,
    userAgent: string | undefined,
  ): Promise<AuthTokens> {
    const payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);
    const successorTokens = await this.refreshGraceService.findSuccessorTokens(
      refreshToken,
      payload,
      userAgent,
    );

    if (successorTokens) {
      return successorTokens;
    }

    const { session } = await this.authSessionService.verifyRefreshTokenSession(
      refreshToken,
      payload,
    );
    const user = await this.usersService.getUserById(payload.sub);

    if (!user || user.status !== UserStatus.Active || !hasEmail(user)) {
      await this.authSessionService.revokeSessionsByUserId(session.userId);
      throw this.createInvalidRefreshTokenException();
    }

    const { sessionId, tokens } =
      await this.authSessionService.createSessionTokens(user);

    await this.authSessionService.revokeSessionById(session.id, sessionId);
    await this.refreshGraceService.remember(session.id, tokens, userAgent);

    return tokens;
  }

  private createInvalidRefreshTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
    });
  }
}
