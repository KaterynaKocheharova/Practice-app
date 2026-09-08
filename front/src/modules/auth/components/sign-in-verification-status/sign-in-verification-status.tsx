"use client";

import { useVerifySignin } from "@/modules/auth/hooks";
import { TEXTS } from "@/modules/common/constants";
import { Verification } from "../verification/verification";
import type { SignInVerificationStatusProps } from "./types";

export const SignInVerificationStatus = ({
  token,
}: SignInVerificationStatusProps) => {
  const { mutateAsync: verifySignin } = useVerifySignin();

  return (
    <Verification
      fallbackErrorMessage={TEXTS.AUTH.SIGN_IN_VERIFICATION_FAILED}
      successMessage={TEXTS.AUTH.SIGN_IN_VERIFIED}
      token={token}
      verify={verifySignin}
    />
  );
};
