import type { Request } from 'express';
import type { RefreshTokenPayload } from './auth-token.type';

export interface RefreshTokenRequest extends Request {
  refreshToken: string;
  refreshTokenPayload: RefreshTokenPayload;
}
