import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { exchangeGoogleOAuthCodeServer } from "@/modules/auth/api/exchange-google-oauth-code-server";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { APP_ROUTES } from "@/modules/common/constants";

const OAUTH_ERROR_FLAG = "1";

/**
 * The backend's Google callback sends the browser here with a one-time code.
 * Exchanging it server-to-server sets the session cookies on this domain; the
 * root page then sends the user to their role's home.
 */
export const GET = async (request: NextRequest) => {
  const { codeParam, errorParam } = AUTH_CONFIG.googleOAuth;
  const code = request.nextUrl.searchParams.get(codeParam);

  if (code && (await exchangeGoogleOAuthCodeServer(code))) {
    redirect(APP_ROUTES.ROOT);
  }

  const searchParams = new URLSearchParams({ [errorParam]: OAUTH_ERROR_FLAG });

  redirect(`${APP_ROUTES.SIGN_IN}?${searchParams.toString()}`);
};
