import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { signInPageStyles } from "./style";

const SignInPage = () => (
  <main className={signInPageStyles.main}>
    <Section className={signInPageStyles.section}>
      <Container>
        <h1 className={signInPageStyles.title}>
          {TEXTS.AUTH.SIGN_IN}
        </h1>
      </Container>
    </Section>
  </main>
);

export default SignInPage;
