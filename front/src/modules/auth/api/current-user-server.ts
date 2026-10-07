import "server-only";

import { API_ROUTES } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import type { CurrentUser } from "../types";

/** Fails soft: any failure means "not signed in". */
export const getCurrentUserServer = async (): Promise<CurrentUser | null> => {
  const response = await serverApiRequest<CurrentUser>(API_ROUTES.USERS.ME);

  return response.ok ? response.data : null;
};
