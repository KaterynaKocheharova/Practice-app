import { GoogleOAuthSuccess } from "@/modules/auth/components";
import { Container, Section } from "@/modules/common/components";
import { googleOAuthSuccessPageStyles } from "./style";

const GoogleOAuthSuccessPage = () => (
  <main className={googleOAuthSuccessPageStyles.main}>
    <Section className={googleOAuthSuccessPageStyles.section}>
      <Container>
        <GoogleOAuthSuccess />
      </Container>
    </Section>
  </main>
);

export default GoogleOAuthSuccessPage;
