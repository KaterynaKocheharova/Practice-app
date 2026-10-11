import { NextResponse, type NextRequest } from "next/server";
import { refreshAuthSession } from "@/modules/auth/api/refresh-auth-session";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { RefreshOutcome } from "@/modules/auth/auth.enums";
import { shouldRefreshSession } from "@/modules/auth/utils";
import { toForwardedCookieOptions } from "@/modules/common/api/forwarded-cookies";

const USER_AGENT_HEADER = "user-agent";

/**
 * The only place that refreshes the session. It runs before every page render
 * and server function call, so pages, layouts and actions always see a valid
 * access token. New cookies go on the request (this render) and the response
 * (the browser). Authorization still happens in pages and in the backend.
 */
export const proxy = async (request: NextRequest) => {
  const { accessToken, refreshToken } = AUTH_CONFIG.cookies;
  const refreshTokenValue = request.cookies.get(refreshToken)?.value;

  if (
    !refreshTokenValue ||
    !shouldRefreshSession(request.cookies.get(accessToken)?.value, refreshTokenValue)
  ) {
    return NextResponse.next();
  }

  const result = await refreshAuthSession(
    refreshTokenValue,
    request.headers.get(USER_AGENT_HEADER),
  );

  // Backend down: keep the cookies and let the page fail soft.
  if (result.outcome === RefreshOutcome.Unavailable) {
    return NextResponse.next();
  }

  // Rejected: the session is over; drop both cookies so we stop retrying.
  if (result.outcome === RefreshOutcome.Rejected) {
    request.cookies.delete(accessToken);
    request.cookies.delete(refreshToken);

    const response = NextResponse.next({ request: { headers: request.headers } });
    response.cookies.delete(accessToken);
    response.cookies.delete(refreshToken);

    return response;
  }

  for (const cookie of result.cookies) {
    request.cookies.set(cookie.name, cookie.value);
  }

  const response = NextResponse.next({ request: { headers: request.headers } });

  for (const cookie of result.cookies) {
    response.cookies.set(cookie.name, cookie.value, toForwardedCookieOptions(cookie));
  }

  return response;
};

export const config = {
  matcher: [
    // Pages and server functions only: skip build assets, images and files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
