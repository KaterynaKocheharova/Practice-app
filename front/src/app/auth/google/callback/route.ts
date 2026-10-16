import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { exchangeGoogleOAuthCodeServer } from "@/modules/auth/api/exchange-google-oauth-code-server";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { GoogleOAuthErrorCode } from "@/modules/auth/auth.enums";
import { APP_ROUTES } from "@/modules/common/constants";

const OAUTH_ERROR_FLAG = "1";

/**
 * The backend's Google callback sends the browser here with a one-time code,
 * or with an error code when it rejected the sign-in. Exchanging the code
 * server-to-server sets the session cookies on this domain; the root page
 * then sends the user to onboarding or their role's home.
 */
export const GET = async (request: NextRequest) => {
  const { callbackErrorParam, codeParam, errorParam } = AUTH_CONFIG.googleOAuth;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get(codeParam);

  if (code && (await exchangeGoogleOAuthCodeServer(code))) {
    redirect(APP_ROUTES.ROOT);
  }

  if (
    searchParams.get(callbackErrorParam) ===
    GoogleOAuthErrorCode.ManagedAccountExists
  ) {
    redirect(APP_ROUTES.INVITE_PENDING);
  }

  const errorSearchParams = new URLSearchParams({
    [errorParam]: OAUTH_ERROR_FLAG,
  });

  redirect(`${APP_ROUTES.SIGN_IN}?${errorSearchParams.toString()}`);
};
