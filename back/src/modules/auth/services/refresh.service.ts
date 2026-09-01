import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserStatus } from 'src/modules/users/enums';
import { UsersService } from 'src/modules/users/services/users.service';
import type { AuthTokens } from '../types';
import { AuthSessionService } from './auth-session.service';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class RefreshService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authTokenService: AuthTokenService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);
    const { session } = await this.authSessionService.verifyRefreshTokenSession(
      refreshToken,
      payload,
    );
    const user = await this.usersService.getUserById(payload.sub);

    if (!user || user.status !== UserStatus.Active) {
      await this.authSessionService.revokeSessionsByUserId(session.userId);
      throw this.createInvalidRefreshTokenException();
    }

    const { sessionId, tokens } =
      await this.authSessionService.createSessionTokens(user);

    await this.authSessionService.revokeSessionById(session.id, sessionId);

    return tokens;
  }

  private createInvalidRefreshTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
    });
  }
}
