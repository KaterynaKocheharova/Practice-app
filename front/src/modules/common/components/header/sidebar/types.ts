export interface SidebarProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLogoutPending: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  sidebarId: string;
}
