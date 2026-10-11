"use client";

import { useOAuthRedirect } from "@/modules/auth/hooks";
import { ERRORS } from "@/modules/common/constants";
import { GoogleOAuthButton } from "./google-oauth-button";
import type { GoogleSignInOAuthButtonProps } from "./types";

export const GoogleSignInOAuthButton = ({
  disabled,
  oauthUrl,
}: GoogleSignInOAuthButtonProps) => {
  const { isPending, redirect } = useOAuthRedirect(
    ERRORS.AUTH.GOOGLE_SIGN_IN_FAILED,
  );

  return (
    <GoogleOAuthButton
      disabled={disabled}
      isPending={isPending}
      onClick={() => redirect(oauthUrl)}
    />
  );
};
