import { randomUUID } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants/jwt-token-service.token';
import type { IJwtTokenService } from 'src/common/jwt/types/jwt-token-service.type';
import type { SafeUserData } from 'src/modules/users/types/user-repository';
import { AuthSessionsRepository } from '../repositories/auth-sessions.repository';
import type {
  AuthTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
} from '../types/auth-token.type';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authSessionsRepository: AuthSessionsRepository,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async createSessionTokens(user: SafeUserData): Promise<AuthTokens> {
    const { accessSecret, accessExpiresIn, refreshSecret, refreshExpiresIn } =
      getAuthEnvConfig(this.configService);
    const sessionId = randomUUID();
    const accessTokenExpiresAt = this.createExpiresAt(accessExpiresIn);
    const refreshTokenExpiresAt = this.createExpiresAt(refreshExpiresIn);
    const accessPayload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshPayload: RefreshTokenPayload = {
      ...accessPayload,
      sessionId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.sign(accessPayload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtTokenService.sign(refreshPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);

    await this.authSessionsRepository.createSession({
      id: sessionId,
      userId: user.id,
      hashedRefreshToken,
      expiresAt: refreshTokenExpiresAt,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  async verifyRefreshTokenSession(
    refreshToken: string,
  ): Promise<RefreshTokenPayload> {
    const { refreshSecret } = getAuthEnvConfig(this.configService);
    const payload = await this.verifyRefreshToken(refreshToken, refreshSecret);
    const session =
      await this.authSessionsRepository.getSessionRefreshVerificationDataById(
        payload.sessionId,
      );

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      !(await this.hashingService.compare(
        refreshToken,
        session.hashedRefreshToken,
      ))
    ) {
      throw this.createInvalidRefreshTokenException();
    }

    return payload;
  }

  private createExpiresAt(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
  }

  private async verifyRefreshToken(
    refreshToken: string,
    refreshSecret: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtTokenService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw this.createInvalidRefreshTokenException();
    }
  }

  private createInvalidRefreshTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
    });
  }
}
