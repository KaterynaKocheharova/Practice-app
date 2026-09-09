"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/modules/common/api";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { verificationStyles } from "./style";
import type { VerificationProps } from "./types";

export const Verification = ({
  fallbackErrorMessage,
  successMessage,
  token,
  verify,
}: VerificationProps) => {
  const router = useRouter();
  const hasRequestedVerification = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : TEXTS.AUTH.INVALID_OR_MISSING_TOKEN,
  );

  useEffect(() => {
    if (hasRequestedVerification.current) {
      return;
    }

    hasRequestedVerification.current = true;

    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        await verify({ token });
        toast.success(successMessage);
        router.replace(APP_ROUTES.HOME);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : fallbackErrorMessage;
        setErrorMessage(message);
        toast.error(message);
      }
    };

    void verifyEmail();
  }, [
    fallbackErrorMessage,
    router,
    successMessage,
    token,
    verify,
  ]);

  if (errorMessage) {
    return (
      <div className={verificationStyles.root}>
        <h1 className={verificationStyles.title}>
          {TEXTS.AUTH.VERIFYING_EMAIL}
        </h1>
        <p className={verificationStyles.error} role="alert">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={verificationStyles.root}>
      <h1 className={verificationStyles.title}>
        {TEXTS.AUTH.VERIFYING_EMAIL}
      </h1>
      <p className={verificationStyles.message} aria-live="polite">
        {TEXTS.AUTH.CHECKING_SESSION}
      </p>
    </div>
  );
};
