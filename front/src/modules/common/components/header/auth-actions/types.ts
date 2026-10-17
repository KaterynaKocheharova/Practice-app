export interface AuthActionsProps {
  displayName?: string;
  isAuthenticated: boolean;
  isLogoutPending: boolean;
  onLogout: () => void;
  stacked?: boolean;
}

export interface AuthenticatedAuthActionsProps {
  displayName?: string;
  isLogoutPending: boolean;
  onLogout: () => void;
  stacked: boolean;
}

export interface UnauthenticatedAuthActionsProps {
  stacked: boolean;
}
