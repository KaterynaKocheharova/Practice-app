export interface SignInResponse {
  message: string;
  email: string;
}

export interface SigninVerificationEmailJobData {
  email: string;
  name: string;
  verificationLink: string;
}
