import { AuthenticatedAuthActions } from "./authenticated-auth-actions/authenticated-auth-actions";
import { UnauthenticatedAuthActions } from "./unauthenticated-auth-actions/unauthenticated-auth-actions";
import type { AuthActionsProps } from "./types";

export const AuthActions = ({
  displayName,
  isAuthenticated,
  isLogoutPending,
  onLogout,
  stacked = false,
}: AuthActionsProps) => {
  if (isAuthenticated) {
    return (
      <AuthenticatedAuthActions
        displayName={displayName}
        isLogoutPending={isLogoutPending}
        onLogout={onLogout}
        stacked={stacked}
      />
    );
  }

  return <UnauthenticatedAuthActions stacked={stacked} />;
};
