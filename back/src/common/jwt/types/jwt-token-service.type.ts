import type { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export interface IJwtTokenService {
  sign<TPayload extends string | object | Buffer>(
    payload: TPayload,
    options?: JwtSignOptions,
  ): Promise<string>;

  verify<TPayload extends object = Record<string, unknown>>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<TPayload>;
}
