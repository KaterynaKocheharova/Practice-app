import { TEXTS } from "@/modules/common/constants";
import { AuthActions } from "../auth-actions/auth-actions";
import { NavLink } from "../nav-link/nav-link";
import { headerDesktopNavStyles } from "./style";
import type { HeaderDesktopNavProps } from "./types";

export const HeaderDesktopNav = ({
  displayName,
  isAuthenticated,
  isLogoutPending,
  navLinks,
  onLogout,
}: HeaderDesktopNavProps) => (
  <nav
    aria-label={TEXTS.NAVIGATION.PRIMARY}
    className={headerDesktopNavStyles.root}
  >
    <div className={headerDesktopNavStyles.links}>
      {navLinks.map(({ href, label }) => (
        <NavLink href={href} key={href}>
          {label}
        </NavLink>
      ))}
    </div>

    <AuthActions
      displayName={displayName}
      isAuthenticated={isAuthenticated}
      isLogoutPending={isLogoutPending}
      onLogout={onLogout}
    />
  </nav>
);
