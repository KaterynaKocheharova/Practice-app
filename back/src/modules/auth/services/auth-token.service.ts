import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants/jwt-token-service.token';
import type { IJwtTokenService } from 'src/common/jwt/types/jwt-token-service.type';
import type { SafeUserData } from 'src/modules/users/types/user-repository';
import type {
  AuthTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
} from '../types/auth-token.type';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
  ) {}

  async createTokens(
    user: SafeUserData,
    sessionId: string,
  ): Promise<AuthTokens> {
    const { accessSecret, accessExpiresIn, refreshSecret, refreshExpiresIn } =
      getAuthEnvConfig(this.configService);
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
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    const { refreshSecret } = getAuthEnvConfig(this.configService);
    return this.verifyRefreshTokenWithSecret(refreshToken, refreshSecret);
  }

  async verifyAccessToken(accessToken: string): Promise<AuthTokenPayload> {
    const { accessSecret } = getAuthEnvConfig(this.configService);

    try {
      return await this.jwtTokenService.verify<AuthTokenPayload>(accessToken, {
        secret: accessSecret,
      });
    } catch {
      throw this.createInvalidAccessTokenException();
    }
  }

  private createExpiresAt(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
  }

  private async verifyRefreshTokenWithSecret(
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

  private createInvalidAccessTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    });
  }
}
