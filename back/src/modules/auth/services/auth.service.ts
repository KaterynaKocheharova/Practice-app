import { Injectable } from '@nestjs/common';
import type { SignUpDto } from '../dto/sign-up.dto';
import type { VerifySignupDto } from '../dto/verify-signup.dto';
import type { VerifySignupResult } from '../types/auth-token.type';
import type { SignUpResponse } from '../types/signup.type';
import { SignupService } from './signup.service';
import { VerifySignupService } from './verify-signup.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly signupService: SignupService,
    private readonly verifySignupService: VerifySignupService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.signupService.signUp(signUpDto);
  }

  async verifySignup(
    verifySignupDto: VerifySignupDto,
  ): Promise<VerifySignupResult> {
    return this.verifySignupService.verifySignup(verifySignupDto);
  }
}
