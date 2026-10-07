import "server-only";

import { cookies } from "next/headers";
import { trimLeadingSlash, trimTrailingSlash } from "@/modules/common/utils";
import type { ServerApiResponse } from "./types";

const JSON_CONTENT_TYPE = "application/json";

export const serverApiRequest = async <TResponse>(
  path: string,
): Promise<ServerApiResponse<TResponse>> => {
  const serverApiUrl = createServerApiUrl(path);

  if (!serverApiUrl) {
    return { ok: false, status: null };
  }

  try {
    const requestCookies = await cookies();
    const response = await fetch(serverApiUrl, {
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: JSON_CONTENT_TYPE,
        Cookie: requestCookies.toString(),
      },
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    return { data: (await response.json()) as TResponse, ok: true };
  } catch {
    return { ok: false, status: null };
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
