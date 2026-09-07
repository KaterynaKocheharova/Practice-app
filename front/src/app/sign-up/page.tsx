import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { signUpPageStyles } from "./style";

const SignUpPage = () => (
  <main className={signUpPageStyles.main}>
    <Section className={signUpPageStyles.section}>
      <Container>
        <h1 className={signUpPageStyles.title}>
          {TEXTS.AUTH.SIGN_UP}
        </h1>
      </Container>
    </Section>
  </main>
);

export default SignUpPage;
