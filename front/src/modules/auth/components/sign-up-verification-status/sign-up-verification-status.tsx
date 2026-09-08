"use client";

import { useVerifySignup } from "@/modules/auth/hooks";
import { TEXTS } from "@/modules/common/constants";
import { Verification } from "../verification/verification";
import type { SignUpVerificationStatusProps } from "./types";

export const SignUpVerificationStatus = ({
  token,
}: SignUpVerificationStatusProps) => {
  const { mutateAsync: verifySignup } = useVerifySignup();

  return (
    <Verification
      fallbackErrorMessage={TEXTS.AUTH.SIGN_UP_VERIFICATION_FAILED}
      successMessage={TEXTS.AUTH.SIGN_UP_VERIFIED}
      token={token}
      verify={verifySignup}
    />
  );
};
