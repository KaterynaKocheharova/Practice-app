"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { APP_ROUTES } from "@/modules/common/constants";
import { AUTH_CONFIG } from "../auth.config";

export const logoutAction = async (): Promise<ServerApiResponse<void>> => {
  await serverApiRequest<void>(API_ROUTES.AUTH.LOGOUT, {
    method: HttpMethod.Post,
  });
  const requestCookies = await cookies();

  requestCookies.delete(AUTH_CONFIG.cookies.accessToken);
  requestCookies.delete(AUTH_CONFIG.cookies.refreshToken);
  redirect(APP_ROUTES.SIGN_IN);
};
