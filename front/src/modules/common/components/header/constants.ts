import { APP_ROUTES, TEXTS } from "@/modules/common/constants";

export const authNavLinks = [
  {
    href: APP_ROUTES.SIGN_IN,
    label: TEXTS.AUTH.SIGN_IN,
    variant: "secondary",
  },
  {
    href: APP_ROUTES.SIGN_UP,
    label: TEXTS.AUTH.SIGN_UP,
    variant: "primary",
  },
] as const;
