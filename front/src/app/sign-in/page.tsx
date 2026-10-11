import { getGoogleSignInOAuthUrlServer } from "@/modules/auth/api/google-oauth-urls-server";
import { AuthFormWrapper, SignInForm } from "@/modules/auth/components";
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
            description={TEXTS.AUTH.CHECK_EMAIL}
            title={TEXTS.AUTH.SIGN_IN}
          >
            <SignInForm
              googleOAuthUrl={getGoogleSignInOAuthUrlServer()}
              hasGoogleOAuthError={oauthError !== undefined}
            />
          </AuthFormWrapper>
        </Container>
      </Section>
    </main>
  );
};

export default SignInPage;
