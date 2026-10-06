import { isApiError } from "@/modules/common/api";

/**
 * 404 for an unknown or inaccessible id, 400 for a malformed one: both mean
 * there is nothing to show at this URL.
 */
export const isMissingResourceError = (error: unknown): boolean =>
  isApiError(error) && (error.status === 404 || error.status === 400);
