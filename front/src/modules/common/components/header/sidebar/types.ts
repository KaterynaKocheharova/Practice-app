import type { PrimaryNavLink } from "../types";

export interface SidebarProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLogoutPending: boolean;
  isOpen: boolean;
  navLinks: PrimaryNavLink[];
  onClose: () => void;
  onLogout: () => void;
  sidebarId: string;
}
