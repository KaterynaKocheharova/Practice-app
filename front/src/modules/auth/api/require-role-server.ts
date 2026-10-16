import "server-only";

import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/modules/common/constants";
import { AUTH_CONFIG } from "../auth.config";
import type { UserRole } from "../auth.enums";
import type { OnboardedUser } from "../types";
import { getCurrentUserServer } from "./current-user-server";

export const requireRoleServer = async (
  ...roles: UserRole[]
): Promise<OnboardedUser> => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    redirect(APP_ROUTES.SIGN_IN);
  }

  const { role } = currentUser;

  if (!role) {
    redirect(APP_ROUTES.ONBOARDING);
  }

  if (!roles.includes(role)) {
    redirect(AUTH_CONFIG.roleHomeRoutes[role]);
  }

  return { ...currentUser, role };
};
