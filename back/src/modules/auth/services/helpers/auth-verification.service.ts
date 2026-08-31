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
    return this.createVerificationLinkWithPath(
      userId,
      email,
      SignupVerificationTokenPurpose.VerifySignUp,
      '/verify-email',
    );
  }

  async createSigninVerificationLink(
    userId: string,
    email: string,
  ): Promise<string> {
    return this.createVerificationLinkWithPath(
      userId,
      email,
      SignupVerificationTokenPurpose.VerifySignIn,
      '/verify-signin',
    );
  }

  async createVerificationLinkWithPath(
    userId: string,
    email: string,
    purpose: SignupVerificationTokenPurpose,
    pathname: string,
  ): Promise<string> {
    const { frontendUrl } = getAuthEnvConfig(this.configService);
    const token = await this.createVerificationToken(userId, email, purpose);
    const verificationUrl = new URL(pathname, frontendUrl);

    verificationUrl.searchParams.set('token', token);

    return verificationUrl.toString();
  }

  async createSignupVerificationToken(
    userId: string,
    email: string,
  ): Promise<string> {
    return this.createVerificationToken(
      userId,
      email,
      SignupVerificationTokenPurpose.VerifySignUp,
    );
  }

  async createSigninVerificationToken(
    userId: string,
    email: string,
  ): Promise<string> {
    return this.createVerificationToken(
      userId,
      email,
      SignupVerificationTokenPurpose.VerifySignIn,
    );
  }

  verifySignupVerificationToken(
    token: string,
  ): Promise<SignupVerificationTokenPayload> {
    const { signupVerificationSecret } = getAuthEnvConfig(this.configService);

    return this.jwtTokenService.verify<SignupVerificationTokenPayload>(token, {
      secret: signupVerificationSecret,
    });
  }

  verifySigninVerificationToken(
    token: string,
  ): Promise<SignupVerificationTokenPayload> {
    return this.verifySignupVerificationToken(token);
  }

  private createVerificationToken(
    userId: string,
    email: string,
    purpose: SignupVerificationTokenPurpose,
  ): Promise<string> {
    const {
      signupVerificationSecret,
      signupVerificationExpiresIn,
      signinVerificationExpiresIn,
    } = getAuthEnvConfig(this.configService);
    const payload: SignupVerificationTokenPayload = {
      sub: userId,
      email,
      purpose,
    };
    const expiresIn =
      purpose === SignupVerificationTokenPurpose.VerifySignIn
        ? signinVerificationExpiresIn
        : signupVerificationExpiresIn;

    return this.jwtTokenService.sign(payload, {
      secret: signupVerificationSecret,
      expiresIn,
    });
  }
}
