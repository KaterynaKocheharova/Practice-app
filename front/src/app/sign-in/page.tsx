import { Container, Section } from "@/modules/common/components";
import { AuthFormShell, SignInForm } from "@/modules/auth/components";
import { TEXTS } from "@/modules/common/constants";
import { signInPageStyles } from "./style";

const SignInPage = () => (
  <main className={signInPageStyles.main}>
    <Section className={signInPageStyles.section}>
      <Container>
        <AuthFormShell
          description={TEXTS.AUTH.CHECK_EMAIL}
          title={TEXTS.AUTH.SIGN_IN}
        >
          <SignInForm />
        </AuthFormShell>
      </Container>
    </Section>
  </main>
);

export default SignInPage;
