"use client";

import { toast } from "sonner";
import { useGoogleSignInOAuth } from "@/modules/auth/hooks";
import { ERRORS } from "@/modules/common/constants";
import { GoogleOAuthButton } from "./google-oauth-button";
import type { GoogleOAuthButtonProps } from "./types";

export const GoogleSignInOAuthButton = ({
  disabled,
}: Pick<GoogleOAuthButtonProps, "disabled">) => {
  const {
    mutateAsync: signInWithGoogle,
    isPending,
  } = useGoogleSignInOAuth();

  const handleClick = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error(ERRORS.AUTH.GOOGLE_SIGN_IN_FAILED);
    }
  };

  return (
    <GoogleOAuthButton
      disabled={disabled}
      isPending={isPending}
      onClick={handleClick}
    />
  );
};
