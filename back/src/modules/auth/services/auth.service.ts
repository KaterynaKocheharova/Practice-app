import { Injectable } from '@nestjs/common';
import type { SignInDto } from '../dto/sign-in.dto';
import type { SignUpDto } from '../dto/sign-up.dto';
import type { ChangePasswordDto } from '../dto/change-password.dto';
import type { VerifySigninDto } from '../dto/verify-signin.dto';
import type { VerifySignupDto } from '../dto/verify-signup.dto';
import type {
  AuthTokens,
  VerifySigninResult,
  VerifySignupResult,
} from '../types/auth-token.type';
import type { SignInResponse } from '../types/signin.type';
import type { SignUpResponse } from '../types/signup.type';
import { ChangePasswordService } from './change-password.service';
import { LogoutService } from './logout.service';
import { RefreshService } from './refresh.service';
import { SigninService } from './signin.service';
import { SignupService } from './signup.service';
import { VerifySigninService } from './verify-signin.service';
import { VerifySignupService } from './verify-signup.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinService: SigninService,
    private readonly signupService: SignupService,
    private readonly verifySigninService: VerifySigninService,
    private readonly verifySignupService: VerifySignupService,
    private readonly refreshService: RefreshService,
    private readonly logoutService: LogoutService,
    private readonly changePasswordService: ChangePasswordService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    return this.signinService.signIn(signInDto);
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.signupService.signUp(signUpDto);
  }

  async verifySignin(
    verifySigninDto: VerifySigninDto,
  ): Promise<VerifySigninResult> {
    return this.verifySigninService.verifySignin(verifySigninDto);
  }

  async verifySignup(
    verifySignupDto: VerifySignupDto,
  ): Promise<VerifySignupResult> {
    return this.verifySignupService.verifySignup(verifySignupDto);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return this.refreshService.refresh(refreshToken);
  }

  async logout(tokens: {
    accessToken?: string;
    refreshToken?: string;
  }): Promise<void> {
    return this.logoutService.logout(tokens);
  }

  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.changePasswordService.changePassword(email, changePasswordDto);
  }
}
