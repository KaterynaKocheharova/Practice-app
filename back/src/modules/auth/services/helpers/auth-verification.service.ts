import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt';
import type { IJwtTokenService } from 'src/common/jwt';
import { SignupVerificationTokenPurpose } from '../../enums';
import type { SignupVerificationTokenPayload } from '../../types';

@Injectable()
export class AuthVerificationService {
  constructor(
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
    private readonly configService: ConfigService,
  ) {}

  async createVerificationLink(userId: string, email: string): Promise<string> {
    const { frontendUrl } = getAuthEnvConfig(this.configService);
    const token = await this.createSignupVerificationToken(userId, email);
    const verificationUrl = new URL('/verify-email', frontendUrl);

    verificationUrl.searchParams.set('token', token);

    return verificationUrl.toString();
  }

  async createSignupVerificationToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const { signupVerificationSecret } = getAuthEnvConfig(this.configService);
    const payload: SignupVerificationTokenPayload = {
      sub: userId,
      email,
      purpose: SignupVerificationTokenPurpose.VerifySignUp,
    };

    return this.jwtTokenService.sign(payload, {
      secret: signupVerificationSecret,
    });
  }
}
