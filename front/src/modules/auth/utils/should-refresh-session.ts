import { AUTH_CONFIG } from "../auth.config";
import { getJwtExpiry } from "./get-jwt-expiry";

const MILLISECONDS_IN_SECOND = 1000;

/**
 * A refresh is due when there is a refresh token and the access token is gone
 * (its cookie expires with it) or about to expire.
 */
export const shouldRefreshSession = (
  accessToken: string | undefined,
  refreshToken: string | undefined,
): boolean => {
  if (!refreshToken) {
    return false;
  }

  if (!accessToken) {
    return true;
  }

  const expiry = getJwtExpiry(accessToken);
  const nowInSeconds = Date.now() / MILLISECONDS_IN_SECOND;

  return (
    expiry === null ||
    expiry - nowInSeconds < AUTH_CONFIG.session.refreshLeewaySeconds
  );
};
