import { API_ROUTES, type ForwardedCookie } from "@/modules/common/api";
import { parseSetCookieHeaders } from "@/modules/common/api/forwarded-cookies";
import { createServerApiUrl } from "@/modules/common/api/server-api-url";
import { HttpMethod } from "@/modules/common/common.enums";
import { RefreshOutcome } from "../auth.enums";
import { AUTH_CONFIG } from "../auth.config";

const UNAUTHORIZED_STATUS = 401;

export type RefreshAuthSessionResult =
  | { cookies: ForwardedCookie[]; outcome: RefreshOutcome.Refreshed }
  | { outcome: RefreshOutcome.Rejected }
  | { outcome: RefreshOutcome.Unavailable };

/**
 * Used only by `src/proxy.ts`, the single place that refreshes. The browser's
 * user agent is forwarded because the backend's refresh grace window is bound
 * to it.
 */
export const refreshAuthSession = async (
  refreshToken: string,
  userAgent: string | null,
): Promise<RefreshAuthSessionResult> => {
  const url = createServerApiUrl(API_ROUTES.AUTH.REFRESH);

  if (!url) {
    return { outcome: RefreshOutcome.Unavailable };
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Cookie: `${AUTH_CONFIG.cookies.refreshToken}=${refreshToken}`,
        ...(userAgent ? { "User-Agent": userAgent } : {}),
      },
      method: HttpMethod.Post,
    });

    if (response.ok) {
      return {
        cookies: parseSetCookieHeaders(response.headers),
        outcome: RefreshOutcome.Refreshed,
      };
    }

    return {
      outcome:
        response.status === UNAUTHORIZED_STATUS
          ? RefreshOutcome.Rejected
          : RefreshOutcome.Unavailable,
    };
  } catch {
    return { outcome: RefreshOutcome.Unavailable };
  }
};
