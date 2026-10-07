/**
 * 404 for an unknown or inaccessible id, 400 for a malformed one: both mean
 * there is nothing to show at this URL.
 */
export const isMissingResourceStatus = (status: number | null): boolean =>
  status === 404 || status === 400;
