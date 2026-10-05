import "server-only";

import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/modules/common/constants";
import { AUTH_CONFIG } from "../auth.config";
import type { UserRole } from "../auth.enums";
import type { CurrentUser } from "../types";
import { getCurrentUserServer } from "./current-user-server";

/**
 * Page-level guard: call it in every protected page, not in a layout,
 * because layouts do not re-render on client navigation.
 */
export const requireRoleServer = async (
  role: UserRole,
): Promise<CurrentUser> => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    redirect(APP_ROUTES.SIGN_IN);
  }

  if (currentUser.role !== role) {
    redirect(AUTH_CONFIG.roleHomeRoutes[currentUser.role]);
  }

  return currentUser;
};
