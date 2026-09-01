import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RefreshTokenRequest } from '../types';

export const CurrentRefreshToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RefreshTokenRequest>();

    return request.refreshToken;
  },
);
