import "server-only";

import { API_ROUTES } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";

/** Trades the callback's one-time code for session cookies on this domain. */
export const exchangeGoogleOAuthCodeServer = async (
  code: string,
): Promise<boolean> => {
  const response = await serverApiRequest<void>(
    API_ROUTES.AUTH.GOOGLE_EXCHANGE,
    { body: { code }, forwardSetCookies: true, method: HttpMethod.Post },
  );

  return response.ok;
};
