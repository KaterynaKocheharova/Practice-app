import "server-only";

import { API_ROUTES } from "@/modules/common/api";
import { createServerApiUrl } from "@/modules/common/api/server-api-url";

export const getGoogleOAuthUrlServer = (): string | null =>
  createServerApiUrl(API_ROUTES.AUTH.GOOGLE);
