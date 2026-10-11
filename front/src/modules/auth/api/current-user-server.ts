import "server-only";

import { cache } from "react";
import { API_ROUTES } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import type { CurrentUser } from "../types";

/**
 * Fails soft: any failure means "not signed in". Cached per request, so the
 * layout, guards and pages share one `/users/me` call.
 */
export const getCurrentUserServer = cache(
  async (): Promise<CurrentUser | null> => {
    const response = await serverApiRequest<CurrentUser>(API_ROUTES.USERS.ME);

    return response.ok ? response.data : null;
  },
);
