import { FormErrorMessage } from "@/modules/common/components";
import { ERRORS } from "@/modules/common/constants";
import { GoogleSignInOAuthButton } from "../google-oauth-button/google-sign-in-oauth-button";
import { googleSignInPanelStyles } from "./style";
import type { GoogleSignInPanelProps } from "./types";

export const GoogleSignInPanel = ({
  hasOAuthError,
  oauthUrl,
}: GoogleSignInPanelProps) => (
  <div className={googleSignInPanelStyles.root}>
    <GoogleSignInOAuthButton oauthUrl={oauthUrl} />
    {hasOAuthError && (
      <FormErrorMessage message={ERRORS.AUTH.GOOGLE_SIGN_IN_FAILED} />
    )}
  </div>
);
