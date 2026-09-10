"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/modules/auth/hooks";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { googleOAuthSuccessStyles } from "./style";

export const GoogleOAuthSuccess = () => {
  const router = useRouter();
  const { currentUser, isError, isLoading } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.replace(APP_ROUTES.HOME);
      router.refresh();
      return;
    }

    if (isError) {
      toast.error(ERRORS.AUTH.GOOGLE_SIGN_IN_FAILED);
      router.replace(APP_ROUTES.SIGN_IN);
      router.refresh();
    }
  }, [currentUser, isError, router]);

  return (
    <div className={googleOAuthSuccessStyles.root}>
      <h1 className={googleOAuthSuccessStyles.title}>
        {TEXTS.AUTH.SIGNING_IN_WITH_GOOGLE}
      </h1>
      <p className={googleOAuthSuccessStyles.message} aria-live="polite">
        {isLoading ? TEXTS.AUTH.CHECKING_SESSION : TEXTS.AUTH.CHECK_EMAIL}
      </p>
    </div>
  );
};
