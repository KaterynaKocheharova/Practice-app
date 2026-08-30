import { SignupVerificationTokenPurpose } from '../enums';

export interface SignUpResponse {
  message: string;
  email: string;
}

export interface SignupVerificationTokenPayload {
  sub: string;
  email: string;
  purpose: SignupVerificationTokenPurpose;
}

export interface SignupVerificationEmailJobData {
  email: string;
  name: string;
  verificationLink: string;
}
