import "server-only";

import { API_ROUTES } from "@/modules/common/api";
import { createServerApiUrl } from "@/modules/common/api/server-api-url";

/**
 * Google sign-in starts with a browser redirect to the backend, which keeps
 * its OAuth state cookie on its own domain. The URL is built on the server so
 * the backend address never ships in the client bundle.
 */
export const getGoogleSignInOAuthUrlServer = (): string | null =>
  createServerApiUrl(API_ROUTES.AUTH.GOOGLE_SIGN_IN);

/** The role is chosen in the form and appended by the client. */
export const getGoogleSignUpOAuthUrlServer = (): string | null =>
  createServerApiUrl(API_ROUTES.AUTH.GOOGLE_SIGN_UP);
