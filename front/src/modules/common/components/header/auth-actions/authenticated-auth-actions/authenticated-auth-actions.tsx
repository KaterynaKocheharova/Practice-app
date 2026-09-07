import { Button } from "../../../button";
import { TEXTS } from "@/modules/common/constants";
import { authenticatedAuthActionsStyles } from "./style";
import type { AuthenticatedAuthActionsProps } from "../types";

export const AuthenticatedAuthActions = ({
  displayName,
  isLogoutPending,
  onLogout,
  stacked,
}: AuthenticatedAuthActionsProps) => (
  <div className={authenticatedAuthActionsStyles.root(stacked)}>
    <p className={authenticatedAuthActionsStyles.userText}>
      {TEXTS.AUTH.HELLO},{" "}
      <span className={authenticatedAuthActionsStyles.userValue}>
        {displayName}
      </span>
    </p>
    <Button
      disabled={isLogoutPending}
      onClick={onLogout}
      size="sm"
      variant="danger"
    >
      {isLogoutPending ? TEXTS.AUTH.LOGGING_OUT : TEXTS.AUTH.LOGOUT}
    </Button>
  </div>
);
