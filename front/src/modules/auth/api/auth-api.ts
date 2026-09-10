import {
  API_ROUTES,
  apiJsonRequest,
  apiRequest,
  createApiUrl,
} from "@/modules/common/api";
import type {
  ChangePasswordRequest,
  CurrentUser,
  GoogleSignUpOAuthRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from "../types";

export function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  return apiJsonRequest<SignUpResponse, SignUpRequest>(API_ROUTES.AUTH.SIGN_UP, data, {
    method: "POST",
  });
}

export function signIn(data: SignInRequest): Promise<SignInResponse> {
  return apiJsonRequest<SignInResponse, SignInRequest>(API_ROUTES.AUTH.SIGN_IN, data, {
    method: "POST",
  });
}

export function verifySignup(
  data: VerifyAuthRequest,
): Promise<VerifyAuthResponse> {
  return apiJsonRequest<VerifyAuthResponse, VerifyAuthRequest>(
    API_ROUTES.AUTH.VERIFY_SIGNUP,
    data,
    {
      method: "POST",
    },
  );
}

export function verifySignin(
  data: VerifyAuthRequest,
): Promise<VerifyAuthResponse> {
  return apiJsonRequest<VerifyAuthResponse, VerifyAuthRequest>(
    API_ROUTES.AUTH.VERIFY_SIGNIN,
    data,
    {
      method: "POST",
    },
  );
}

export function refreshAuth(): Promise<void> {
  return apiRequest<void>(API_ROUTES.AUTH.REFRESH, {
    method: "POST",
    skipAuthRefresh: true,
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>(API_ROUTES.AUTH.LOGOUT, {
    method: "POST",
    skipAuthRefresh: true,
  });
}

export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return apiJsonRequest<void, ChangePasswordRequest>(
    API_ROUTES.AUTH.CHANGE_PASSWORD,
    data,
    {
      method: "POST",
    },
  );
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>(API_ROUTES.USERS.ME);
}

export function createGoogleSignInOAuthUrl(): string {
  return createApiUrl(API_ROUTES.AUTH.GOOGLE_SIGN_IN);
}

export function createGoogleSignUpOAuthUrl({
  role,
}: GoogleSignUpOAuthRequest): string {
  const searchParams = new URLSearchParams({
    role,
  });

  return `${createApiUrl(API_ROUTES.AUTH.GOOGLE_SIGN_UP)}?${searchParams.toString()}`;
}
