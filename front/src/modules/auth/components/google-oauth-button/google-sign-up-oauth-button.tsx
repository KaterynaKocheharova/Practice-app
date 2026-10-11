"use client";

import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { useOAuthRedirect } from "@/modules/auth/hooks";
import { ERRORS } from "@/modules/common/constants";
import { GoogleOAuthButton } from "./google-oauth-button";
import type { GoogleSignUpOAuthButtonProps } from "./types";

export const GoogleSignUpOAuthButton = ({
  disabled,
  oauthUrl,
  role,
}: GoogleSignUpOAuthButtonProps) => {
  const { isPending, redirect } = useOAuthRedirect(
    ERRORS.AUTH.GOOGLE_SIGN_UP_FAILED,
  );

  const handleClick = () => {
    const searchParams = new URLSearchParams({
      [AUTH_CONFIG.googleOAuth.roleParam]: role,
    });

    redirect(oauthUrl && `${oauthUrl}?${searchParams.toString()}`);
  };

  return (
    <GoogleOAuthButton
      disabled={disabled}
      isPending={isPending}
      onClick={handleClick}
    />
  );
};
