"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { AUTH_CONFIG } from "../auth.config";
import type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from "../types";

export const signInAction = async (
  data: SignInRequest,
): Promise<ServerApiResponse<SignInResponse>> =>
  serverApiRequest<SignInResponse>(API_ROUTES.AUTH.SIGN_IN, {
    body: data,
    method: HttpMethod.Post,
  });

export const signUpAction = async (
  data: SignUpRequest,
): Promise<ServerApiResponse<SignUpResponse>> =>
  serverApiRequest<SignUpResponse>(API_ROUTES.AUTH.SIGN_UP, {
    body: data,
    method: HttpMethod.Post,
  });

/** The backend's session cookies are re-set on this domain. */
export const verifySigninAction = async (
  data: VerifyAuthRequest,
): Promise<ServerApiResponse<VerifyAuthResponse>> =>
  serverApiRequest<VerifyAuthResponse>(API_ROUTES.AUTH.VERIFY_SIGNIN, {
    body: data,
    forwardSetCookies: true,
    method: HttpMethod.Post,
  });

export const verifySignupAction = async (
  data: VerifyAuthRequest,
): Promise<ServerApiResponse<VerifyAuthResponse>> =>
  serverApiRequest<VerifyAuthResponse>(API_ROUTES.AUTH.VERIFY_SIGNUP, {
    body: data,
    forwardSetCookies: true,
    method: HttpMethod.Post,
  });

/**
 * The backend revokes the session; the cookies are dropped here whatever it
 * answers, so a backend outage cannot keep someone signed in on this device.
 */
export const logoutAction = async (): Promise<ServerApiResponse<void>> => {
  const response = await serverApiRequest<void>(API_ROUTES.AUTH.LOGOUT, {
    method: HttpMethod.Post,
  });
  const requestCookies = await cookies();

  requestCookies.delete(AUTH_CONFIG.cookies.accessToken);
  requestCookies.delete(AUTH_CONFIG.cookies.refreshToken);
  refresh();

  return response;
};
