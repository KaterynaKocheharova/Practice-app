export interface HeaderDesktopNavProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLogoutPending: boolean;
  onLogout: () => void;
}
