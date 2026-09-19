import { Container, Section } from "@/modules/common/components";
import { AuthFormShell, SignUpForm } from "@/modules/auth/components";
import { TEXTS } from "@/modules/common/constants";
import { signUpPageStyles } from "./style";

const SignUpPage = () => (
  <main className={signUpPageStyles.main}>
    <Section className={signUpPageStyles.section}>
      <Container>
        <AuthFormShell
          description={TEXTS.AUTH.CHECK_EMAIL}
          title={TEXTS.AUTH.SIGN_UP}
        >
          <SignUpForm />
        </AuthFormShell>
      </Container>
    </Section>
  </main>
);

export default SignUpPage;
