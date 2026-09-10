"use client";

import { toast } from "sonner";
import { useGoogleSignUpOAuth } from "@/modules/auth/hooks";
import { ERRORS } from "@/modules/common/constants";
import { GoogleOAuthButton } from "./google-oauth-button";
import type { GoogleSignUpOAuthButtonProps } from "./types";

export const GoogleSignUpOAuthButton = ({
  disabled,
  role,
}: GoogleSignUpOAuthButtonProps) => {
  const {
    mutateAsync: signUpWithGoogle,
    isPending,
  } = useGoogleSignUpOAuth();

  const handleClick = async () => {
    try {
      await signUpWithGoogle({ role });
    } catch {
      toast.error(ERRORS.AUTH.GOOGLE_SIGN_UP_FAILED);
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
