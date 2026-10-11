const JWT_PART_SEPARATOR = ".";
const BASE64URL_PATTERN = { minus: /-/g, underscore: /_/g };

/**
 * Reads a JWT's `exp` (seconds since epoch) without verifying it. Only used to
 * time a refresh; the backend still verifies every token it receives.
 */
export const getJwtExpiry = (token: string): number | null => {
  const [, payload] = token.split(JWT_PART_SEPARATOR);

  if (!payload) {
    return null;
  }

  try {
    const json = atob(
      payload
        .replace(BASE64URL_PATTERN.minus, "+")
        .replace(BASE64URL_PATTERN.underscore, "/"),
    );
    const { exp } = JSON.parse(json) as { exp?: unknown };

    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
};
