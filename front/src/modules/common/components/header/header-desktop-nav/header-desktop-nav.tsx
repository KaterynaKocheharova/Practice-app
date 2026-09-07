import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { AuthActions } from "../auth-actions/auth-actions";
import { NavLink } from "../nav-link";
import { headerDesktopNavStyles } from "./style";
import type { HeaderDesktopNavProps } from "./types";

const primaryNavLinks = [
  {
    href: APP_ROUTES.HOME,
    label: TEXTS.NAVIGATION.HOME,
  },
] as const;

export const HeaderDesktopNav = ({
  displayName,
  isAuthenticated,
  isLogoutPending,
  onLogout,
}: HeaderDesktopNavProps) => (
  <nav
    aria-label={TEXTS.NAVIGATION.PRIMARY}
    className={headerDesktopNavStyles.root}
  >
    <div className={headerDesktopNavStyles.links}>
      {primaryNavLinks.map(({ href, label }) => (
        <NavLink href={href} key={href}>
          {label}
        </NavLink>
      ))}
    </div>

    <AuthActions
      displayName={displayName}
      isAuthenticated={isAuthenticated}
      isLoading={false}
      isLogoutPending={isLogoutPending}
      onLogout={onLogout}
    />
  </nav>
);
