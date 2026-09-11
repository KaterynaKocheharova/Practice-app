import { COMMON_CONFIG } from "@/modules/common/common.config";
import { TEXTS } from "@/modules/common/constants";
import { AuthActions } from "../auth-actions/auth-actions";
import { NavLink } from "../nav-link";
import { headerDesktopNavStyles } from "./style";
import type { HeaderDesktopNavProps } from "./types";

export const HeaderDesktopNav = ({
  displayName,
  isAuthenticated,
  isLoading,
  isLogoutPending,
  onLogout,
}: HeaderDesktopNavProps) => (
  <nav
    aria-label={TEXTS.NAVIGATION.PRIMARY}
    className={headerDesktopNavStyles.root}
  >
    <div className={headerDesktopNavStyles.links}>
      {COMMON_CONFIG.header.primaryNavLinks.map(({ href, label }) => (
        <NavLink href={href} key={href}>
          {label}
        </NavLink>
      ))}
    </div>

    <AuthActions
      displayName={displayName}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      isLogoutPending={isLogoutPending}
      onLogout={onLogout}
    />
  </nav>
);
