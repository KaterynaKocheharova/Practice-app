import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import type { UserRole } from 'src/modules/users/enums';
import { AUTH_METADATA } from '../constants/auth-metadata.constant';
import type { AuthenticatedRequest } from '../types/authenticated-request.type';

/**
 * Must run after JwtAccessGuard, which populates `request.user`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(AUTH_METADATA.ROLES, [context.getHandler(), context.getClass()]);

    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!this.isRoleAllowed(request.user?.role, allowedRoles)) {
      throw new ForbiddenException({ errorCode: ERROR_CODE.FORBIDDEN });
    }

    return true;
  }

  private isRoleAllowed(
    role: UserRole | undefined,
    allowedRoles: UserRole[],
  ): boolean {
    return !!role && allowedRoles.includes(role);
  }
}
