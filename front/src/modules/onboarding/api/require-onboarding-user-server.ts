import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/modules/auth/api/current-user-server";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import type { CurrentUser } from "@/modules/auth/types";
import { APP_ROUTES } from "@/modules/common/constants";

export const requireOnboardingUserServer = async (): Promise<CurrentUser> => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    redirect(APP_ROUTES.SIGN_IN);
  }

  if (currentUser.role) {
    redirect(AUTH_CONFIG.roleHomeRoutes[currentUser.role]);
  }

  return currentUser;
};
