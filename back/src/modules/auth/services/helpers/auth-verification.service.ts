import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getAuthEnvConfig } from 'src/common/configs/env-config';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { JWT_TOKEN_SERVICE } from 'src/common/jwt/constants/jwt-token-service.token';
import type { IJwtTokenService } from 'src/common/jwt/types/jwt-token-service.type';
import { SignupVerificationTokenPurpose } from '../../enums/signup-verification-token-purpose.enum';
import { VerificationLinksRepository } from '../../repositories';
import type { VerificationLinkVerificationData } from '../../types';
import type { SignupVerificationTokenPayload } from '../../types/signup.type';

@Injectable()
export class AuthVerificationService {
  constructor(
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: IJwtTokenService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
    private readonly verificationLinksRepository: VerificationLinksRepository,
    private readonly configService: ConfigService,
  ) {}

  async createVerificationLink(
    userId: string,
    email: string,
    purpose: SignupVerificationTokenPurpose,
  ): Promise<string> {
    const { frontendUrl } = getAuthEnvConfig(this.configService);
    const token = await this.createVerificationToken(userId, email, purpose);
    const verificationUrl = new URL(
      this.getVerificationPathname(purpose),
      frontendUrl,
    );

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

  async consumeVerificationLink(
    token: string,
    payload: SignupVerificationTokenPayload,
    purpose: SignupVerificationTokenPurpose,
  ): Promise<boolean> {
    const verificationLink =
      await this.verificationLinksRepository.getVerificationLinkById(
        payload.jti,
      );

    if (!verificationLink) {
      return false;
    }

    if (!this.isVerificationLinkValid(verificationLink, payload, purpose)) {
      return false;
    }

    if (!(await this.isVerificationLinkTokenValid(token, verificationLink))) {
      return false;
    }

    return this.verificationLinksRepository.markVerificationLinkUsedById(
      payload.jti,
    );
  }

  private isVerificationLinkValid(
    verificationLink: VerificationLinkVerificationData,
    payload: SignupVerificationTokenPayload,
    purpose: SignupVerificationTokenPurpose,
  ): boolean {
    return (
      verificationLink.userId === payload.sub &&
      verificationLink.email === payload.email &&
      verificationLink.purpose === purpose &&
      verificationLink.expiresAt > new Date() &&
      !verificationLink.usedAt &&
      !verificationLink.revokedAt
    );
  }

  private isVerificationLinkTokenValid(
    token: string,
    verificationLink: VerificationLinkVerificationData,
  ): Promise<boolean> {
    return this.hashingService.compare(token, verificationLink.hashedToken);
  }

  private async createVerificationToken(
    userId: string,
    email: string,
    purpose: SignupVerificationTokenPurpose,
  ): Promise<string> {
    const {
      signupVerificationSecret,
      signupVerificationExpiresIn,
      signinVerificationExpiresIn,
    } = getAuthEnvConfig(this.configService);
    const tokenId = randomUUID();
    const payload: SignupVerificationTokenPayload = {
      sub: userId,
      jti: tokenId,
      email,
      purpose,
    };
    const expiresIn =
      purpose === SignupVerificationTokenPurpose.VerifySignIn
        ? signinVerificationExpiresIn
        : signupVerificationExpiresIn;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const token = await this.jwtTokenService.sign(payload, {
      secret: signupVerificationSecret,
      expiresIn,
    });
    const hashedToken = await this.hashingService.hash(token);

    await this.verificationLinksRepository.revokeUnusedVerificationLinksByUserIdAndPurpose(
      userId,
      purpose,
    );

    await this.verificationLinksRepository.createVerificationLink({
      id: tokenId,
      userId,
      email,
      purpose,
      hashedToken,
      expiresAt,
    });

    return token;
  }

  private getVerificationPathname(
    purpose: SignupVerificationTokenPurpose,
  ): string {
    return purpose === SignupVerificationTokenPurpose.VerifySignIn
      ? '/verify-signin'
      : '/verify-signup';
  }
}
