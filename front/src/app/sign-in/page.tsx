import { getGoogleOAuthUrlServer } from "@/modules/auth/api/google-oauth-urls-server";
import { AuthFormWrapper, GoogleSignInPanel } from "@/modules/auth/components";
import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { signInPageStyles } from "./style";
import type { SignInPageProps } from "./types";

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { oauthError } = await searchParams;

  return (
    <main className={signInPageStyles.main}>
      <Section className={signInPageStyles.section}>
        <Container>
          <AuthFormWrapper
            description={TEXTS.AUTH.SIGN_IN_DESCRIPTION}
            title={TEXTS.AUTH.SIGN_IN}
          >
            <GoogleSignInPanel
              hasOAuthError={oauthError !== undefined}
              oauthUrl={getGoogleOAuthUrlServer()}
            />
          </AuthFormWrapper>
        </Container>
      </Section>
    </main>
  );
};

export default SignInPage;
