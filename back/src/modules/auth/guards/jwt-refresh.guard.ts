import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRequestCookie } from 'src/common/auth/utils/cookie.util';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants';
import type { IJwtTokenService } from 'src/common/jwt/types';
import { authConfig } from '../config';
import type { RefreshTokenPayload, RefreshTokenRequest } from '../types';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RefreshTokenRequest>();
    const token = getRequestCookie(request, authConfig.COOKIES.REFRESH_TOKEN);

    if (!token) {
      throw this.createInvalidRefreshTokenException();
    }

    request.refreshTokenPayload = await this.verifyRefreshToken(token);
    request.refreshToken = token;

    return true;
  }

  private async verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    const { refreshSecret } = getAuthEnvConfig(this.configService);

    try {
      return await this.jwtTokenService.verify<RefreshTokenPayload>(token, {
        secret: refreshSecret,
      });
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
