import type { PrimaryNavLink } from "../types";

export interface HeaderDesktopNavProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLogoutPending: boolean;
  navLinks: PrimaryNavLink[];
  onLogout: () => void;
}
