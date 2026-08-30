import { Injectable } from '@nestjs/common';
import {
  JwtService,
  type JwtSignOptions,
  type JwtVerifyOptions,
} from '@nestjs/jwt';

import type { IJwtTokenService } from '../types';

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign<TPayload extends string | object | Buffer>(
    payload: TPayload,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload as never, options);
  }

  verify<TPayload extends object = Record<string, unknown>>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<TPayload> {
    return this.jwtService.verifyAsync<TPayload>(token, options);
  }
}
