import { Container, Section } from "@/modules/common/components";
import { AuthFormWrapper, SignUpForm } from "@/modules/auth/components";
import { TEXTS } from "@/modules/common/constants";
import { signUpPageStyles } from "./style";

const SignUpPage = () => (
  <main className={signUpPageStyles.main}>
    <Section className={signUpPageStyles.section}>
      <Container>
        <AuthFormWrapper
          description={TEXTS.AUTH.CHECK_EMAIL}
          title={TEXTS.AUTH.SIGN_UP}
        >
          <SignUpForm />
        </AuthFormWrapper>
      </Container>
    </Section>
  </main>
);

export default SignUpPage;
