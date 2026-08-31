export interface AuthEnvConfig {
  signupVerificationSecret: string;
  signupVerificationExpiresIn: number;
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
  frontendUrl: string;
}
