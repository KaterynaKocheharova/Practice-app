import { SignupVerificationTokenPurpose } from '../enums';

export interface SignupVerificationTokenPayload {
  sub: string;
  email: string;
  purpose: SignupVerificationTokenPurpose;
}
