import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants/jwt-token-service.token';
import type { IJwtTokenService } from 'src/common/jwt/types/jwt-token-service.type';
import { SignupVerificationTokenPurpose } from '../../enums/signup-verification-token-purpose.enum';
import type { SignupVerificationTokenPayload } from '../../types/signup.type';

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
    const { signupVerificationSecret, signupVerificationExpiresIn } =
      getAuthEnvConfig(this.configService);
    const payload: SignupVerificationTokenPayload = {
      sub: userId,
      email,
      purpose: SignupVerificationTokenPurpose.VerifySignUp,
    };

    return this.jwtTokenService.sign(payload, {
      secret: signupVerificationSecret,
      expiresIn: signupVerificationExpiresIn,
    });
  }

  verifySignupVerificationToken(
    token: string,
  ): Promise<SignupVerificationTokenPayload> {
    const { signupVerificationSecret } = getAuthEnvConfig(this.configService);

    return this.jwtTokenService.verify<SignupVerificationTokenPayload>(token, {
      secret: signupVerificationSecret,
    });
  }
}
