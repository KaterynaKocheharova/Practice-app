import { Loader } from "../../loader/loader";
import { AuthenticatedAuthActions } from "./authenticated-auth-actions/authenticated-auth-actions";
import { UnauthenticatedAuthActions } from "./unauthenticated-auth-actions/unauthenticated-auth-actions";
import { authActionsStyles } from "./style";
import type { AuthActionsProps } from "./types";

export const AuthActions = ({
  displayName,
  isAuthenticated,
  isLoading,
  isLogoutPending,
  onLogout,
  stacked = false,
}: AuthActionsProps) => {
  if (isLoading) {
    return <Loader className={authActionsStyles.loading} />;
  }

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
