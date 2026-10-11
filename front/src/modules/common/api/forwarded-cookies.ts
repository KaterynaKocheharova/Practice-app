import type { ForwardedCookie } from "./types";

const ATTRIBUTE_SEPARATOR = ";";
const VALUE_SEPARATOR = "=";
const EXPIRES_ATTRIBUTE = "expires";
const MAX_AGE_ATTRIBUTE = "max-age";

/**
 * Reads the backend's `Set-Cookie` headers. Only name, value and lifetime are
 * kept: domain, path and flags are this app's own (see `toForwardedCookieOptions`).
 */
export const parseSetCookieHeaders = (headers: Headers): ForwardedCookie[] =>
  headers.getSetCookie().flatMap((header) => {
    const [pair, ...attributes] = header.split(ATTRIBUTE_SEPARATOR);
    const separatorIndex = pair.indexOf(VALUE_SEPARATOR);

    if (separatorIndex <= 0) {
      return [];
    }

    const cookie: ForwardedCookie = {
      name: pair.slice(0, separatorIndex).trim(),
      value: decodeURIComponent(pair.slice(separatorIndex + 1).trim()),
    };

    for (const attribute of attributes) {
      const [rawKey, ...rawValue] = attribute.split(VALUE_SEPARATOR);
      const key = rawKey.trim().toLowerCase();
      const value = rawValue.join(VALUE_SEPARATOR).trim();

      if (key === EXPIRES_ATTRIBUTE) {
        cookie.expires = new Date(value);
      }

      if (key === MAX_AGE_ATTRIBUTE) {
        cookie.maxAge = Number(value);
      }
    }

    return [cookie];
  });

/** Session cookies stay unreadable to scripts and are sent only by this site. */
export const toForwardedCookieOptions = ({
  expires,
  maxAge,
}: ForwardedCookie) => ({
  expires,
  httpOnly: true,
  maxAge,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});
