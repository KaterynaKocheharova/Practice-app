import "server-only";

import { cookies } from "next/headers";
import { API_ROUTES } from "@/modules/common/api";
import { trimLeadingSlash, trimTrailingSlash } from "@/modules/common/utils";
import type { CurrentUser } from "../types";

const JSON_CONTENT_TYPE = "application/json";

export const getCurrentUserServer = async (): Promise<CurrentUser | null> => {
  const requestCookies = await cookies();
  const serverApiUrl: string | null = createServerApiUrl(API_ROUTES.USERS.ME);

  if (!serverApiUrl) {
    return null;
  }

  try {
    const response = await fetch(serverApiUrl, {
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: JSON_CONTENT_TYPE,
        Cookie: requestCookies.toString(),
      },
    });

    if (response.status === 401 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CurrentUser;
  } catch {
    return null;
  }
};

const createServerApiUrl = (path: string): string | null => {
  const normalizedPath = trimLeadingSlash(path);
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseUrl) {
    try {
      return new URL(
        normalizedPath,
        `${trimTrailingSlash(configuredBaseUrl)}/`,
      ).toString();
    } catch {
      return null;
    }
  }

  return null;
};
