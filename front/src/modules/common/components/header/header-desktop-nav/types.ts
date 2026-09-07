export interface HeaderDesktopNavProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLogoutPending: boolean;
  onLogout: () => void;
}
