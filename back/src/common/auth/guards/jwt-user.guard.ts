import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants';
import type { IJwtTokenService } from 'src/common/jwt/types';
import { authConfig } from 'src/modules/auth/config';
import type { UserStatus } from 'src/modules/users/enums';
import { UsersService } from 'src/modules/users/services/users.service';
import type {
  CurrentUserData,
  CurrentUserResponse,
} from 'src/modules/users/types';
import type { AuthTokenPayload } from 'src/modules/auth/types';
import type { AuthenticatedRequest } from '../types/authenticated-request.type';
import { getRequestCookie } from '../utils/cookie.util';

@Injectable()
export abstract class JwtUserGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
  ) {}

  protected abstract assertStatusAllowed(status: UserStatus): void;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = getRequestCookie(request, authConfig.COOKIES.ACCESS_TOKEN);

    if (!token) {
      throw this.createInvalidAccessTokenException();
    }

    const payload = await this.verifyAccessToken(token);
    const user = await this.usersService.getCurrentUserDataById(payload.sub);

    if (!user || !this.isEmailValid(user.email, payload.email)) {
      throw this.createInvalidAccessTokenException();
    }

    this.assertStatusAllowed(user.status);
    request.user = this.createAuthenticatedUser(user, payload);

    return true;
  }

  protected createInvalidAccessTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    });
  }

  private createAuthenticatedUser(
    user: CurrentUserData,
    payload: AuthTokenPayload,
  ): CurrentUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: payload.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  private isEmailValid(
    userEmail: string | null,
    payloadEmail: string,
  ): boolean {
    return userEmail === payloadEmail;
  }

  private async verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    const { accessSecret } = getAuthEnvConfig(this.configService);

    try {
      return await this.jwtTokenService.verify<AuthTokenPayload>(token, {
        secret: accessSecret,
      });
    } catch {
      throw this.createInvalidAccessTokenException();
    }
  }
}
