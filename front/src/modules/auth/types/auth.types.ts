export const UserRole = {
  Teacher: "teacher",
  Student: "student",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignUpResponse {
  message: string;
  email: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  email: string;
}

export interface VerifyAuthRequest {
  token: string;
}

export interface VerifyAuthResponse {
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GoogleSignUpOAuthRequest {
  role: UserRole;
}
