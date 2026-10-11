import { verifySigninAction } from "@/modules/auth/actions/auth-actions";
import { TEXTS } from "@/modules/common/constants";
import { Verification } from "../verification/verification";
import type { SignInVerificationStatusProps } from "./types";

export const SignInVerificationStatus = ({
  token,
}: SignInVerificationStatusProps) => (
  <Verification
    fallbackErrorMessage={TEXTS.AUTH.SIGN_IN_VERIFICATION_FAILED}
    successMessage={TEXTS.AUTH.SIGN_IN_VERIFIED}
    token={token}
    verify={verifySigninAction}
  />
);
