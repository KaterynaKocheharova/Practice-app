import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";
import { API_ROUTES } from "@/modules/common/api";
import { TEXTS } from "@/modules/common/constants";
import { trimLeadingSlash, trimTrailingSlash } from "@/modules/common/utils";
import type { CurrentUser } from "../types";

const JSON_CONTENT_TYPE = "application/json";

export const getCurrentUserServer = cache(
  async (): Promise<CurrentUser | null> => {
    const requestCookies = await cookies();
    const response = await fetch(await createServerApiUrl(API_ROUTES.USERS.ME), {
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: JSON_CONTENT_TYPE,
        Cookie: requestCookies.toString(),
      },
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(TEXTS.ERRORS.FAILED_TO_FETCH_CURRENT_USER);
    }

    return (await response.json()) as CurrentUser;
  },
);

const createServerApiUrl = async (path: string): Promise<string> => {
  const normalizedPath = trimLeadingSlash(path);
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseUrl) {
    return `${trimTrailingSlash(configuredBaseUrl)}/${normalizedPath}`;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error(TEXTS.ERRORS.CANNOT_RESOLVE_SERVER_API_URL);
  }

  return `${protocol}://${host}/${normalizedPath}`;
};
