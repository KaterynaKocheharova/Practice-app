export interface AuthEnvConfig {
  signupVerificationSecret: string;
  signupVerificationExpiresIn: number;
  signinVerificationExpiresIn: number;
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
  frontendUrl: string;
  googleOAuthClientId: string;
  googleOAuthClientSecret: string;
  googleOAuthRedirectUri: string;
  googleOAuthStateSecret: string;
}
