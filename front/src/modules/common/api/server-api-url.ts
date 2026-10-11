import { trimLeadingSlash, trimTrailingSlash } from "../utils";

/**
 * The backend lives on another site, so only the Next server talks to it.
 * `null` when `API_URL` is missing or invalid: callers fail soft.
 */
export const createServerApiUrl = (path: string): string | null => {
  const baseUrl = process.env.API_URL;

  if (!baseUrl) {
    return null;
  }

  try {
    return new URL(
      trimLeadingSlash(path),
      `${trimTrailingSlash(baseUrl)}/`,
    ).toString();
  } catch {
    return null;
  }
};
