import { UserRole } from "@/modules/auth/auth.enums";
import { APP_ROUTES, TEXTS } from "./constants";
import { NavLinkVariant } from "./common.enums";

export const COMMON_CONFIG = {
  header: {
    authNavLinks: [
      {
        href: APP_ROUTES.SIGN_IN,
        label: TEXTS.AUTH.SIGN_IN,
        variant: NavLinkVariant.Secondary,
      },
    ],
    primaryNavLinks: [
      {
        href: APP_ROUTES.STUDENTS,
        label: TEXTS.NAVIGATION.STUDENTS,
        roles: [UserRole.Teacher],
      },
      {
        href: APP_ROUTES.COURSES,
        label: TEXTS.NAVIGATION.COURSES,
        roles: [UserRole.Student],
      },
    ],
  },
};
