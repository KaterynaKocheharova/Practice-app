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
import { AUTH_COOKIE_NAMES } from 'src/modules/auth/constants';
import { UserStatus } from 'src/modules/users/enums';
import { UsersService } from 'src/modules/users/services/users.service';
import type { CurrentUserData } from 'src/modules/users/types';
import type { AuthTokenPayload } from 'src/modules/auth/types';
import type { AuthenticatedRequest } from '../types/authenticated-request.type';
import { getRequestCookie } from '../utils/cookie.util';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = getRequestCookie(request, AUTH_COOKIE_NAMES.ACCESS_TOKEN);

    if (!token) {
      throw this.createInvalidAccessTokenException();
    }

    const payload = await this.verifyAccessToken(token);
    const user = await this.usersService.getCurrentUserDataById(payload.sub);

    if (!this.isUserValid(user, payload)) {
      throw this.createInvalidAccessTokenException();
    }

    request.user = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return true;
  }

  private isUserValid(
    user: CurrentUserData | undefined,
    payload: AuthTokenPayload,
  ): user is CurrentUserData {
    return (
      !!user &&
      this.isEmailValid(user.email, payload.email) &&
      this.isStatusValid(user.status)
    );
  }

  private isEmailValid(userEmail: string, payloadEmail: string): boolean {
    return userEmail === payloadEmail;
  }

  private isStatusValid(status: UserStatus): boolean {
    return status === UserStatus.Active;
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

  private createInvalidAccessTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    });
  }
}
