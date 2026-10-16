"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { AUTH_CONFIG } from "../auth.config";

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
