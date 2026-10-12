import type { UserRole } from "@/modules/auth/auth.enums";
import { COMMON_CONFIG } from "../common.config";
import type { PrimaryNavLink } from "../components/header/types";

export const getPrimaryNavLinks = (role?: UserRole): PrimaryNavLink[] =>
  role
    ? COMMON_CONFIG.header.primaryNavLinks.filter(({ roles }) =>
        roles.includes(role),
      )
    : [];
