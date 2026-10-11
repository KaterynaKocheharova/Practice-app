"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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

    // Backend text is never shown: it could reveal whether an account exists.
    const verifyEmail = async () => {
      try {
        const result = await verify({ token });

        if (!result.ok) {
          setErrorMessage(fallbackErrorMessage);
          toast.error(fallbackErrorMessage);
          return;
        }

        toast.success(successMessage);
        router.replace(APP_ROUTES.ROOT);
        router.refresh();
      } catch {
        setErrorMessage(fallbackErrorMessage);
        toast.error(fallbackErrorMessage);
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
