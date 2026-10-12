import { trimLeadingSlash, trimTrailingSlash } from "../utils";

const QUERY_SEPARATOR = "?";
const PATH_SEPARATOR = "/";
/** `.` or `..`, also percent-encoded: URL parsing resolves both forms. */
const DOT_SEGMENT_PATTERN = /^(?:\.|%2e){1,2}$/i;


const hasDotSegment = (path: string): boolean =>
  path
    .split(QUERY_SEPARATOR, 1)[0]
    .split(PATH_SEPARATOR)
    .some((segment) => DOT_SEGMENT_PATTERN.test(segment));

/**
 * The backend lives on another site, so only the Next server talks to it.
 * `null` when `API_URL` is missing or invalid, or the path tries to leave its
 * route: callers fail soft.
 */
export const createServerApiUrl = (path: string): string | null => {
  const baseUrl = process.env.API_URL;

  if (!baseUrl || hasDotSegment(path)) {
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
