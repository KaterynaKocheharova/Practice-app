import {
  API_ROUTES,
  apiJsonRequest,
  apiRequest,
  createApiUrl,
} from "@/modules/common/api";
import type {
  ChangePasswordRequest,
  CurrentUser,
  GoogleOAuthRequest,
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

export function createGoogleOAuthUrl({ role }: GoogleOAuthRequest): string {
  const url = new URL(createApiUrl(API_ROUTES.AUTH.GOOGLE));
  url.searchParams.set("role", role);

  return url.toString();
}
