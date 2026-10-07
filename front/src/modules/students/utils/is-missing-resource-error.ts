import { isApiError } from "@/modules/common/api";
import { isMissingResourceStatus } from "./is-missing-resource-status";

export const isMissingResourceError = (error: unknown): boolean =>
  isApiError(error) && isMissingResourceStatus(error.status);
