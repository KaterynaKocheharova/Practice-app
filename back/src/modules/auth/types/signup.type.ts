import { SignupVerificationTokenPurpose } from '../enums/signup-verification-token-purpose.enum';

export interface SignUpResponse {
  message: string;
  email: string;
}

export interface SignupVerificationTokenPayload {
  sub: string;
  jti: string;
  email: string;
  purpose: SignupVerificationTokenPurpose;
}

export interface SignupVerificationEmailJobData {
  email: string;
  name: string;
  verificationLink: string;
}
