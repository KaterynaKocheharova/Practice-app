import { AuthFormWrapper } from "@/modules/auth/components";
import { ButtonLink, Container, Section } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { invitePendingPageStyles } from "./style";

const InvitePendingPage = () => (
  <main className={invitePendingPageStyles.main}>
    <Section className={invitePendingPageStyles.section}>
      <Container>
        <AuthFormWrapper
          description={TEXTS.AUTH.INVITE_PENDING_DESCRIPTION}
          title={TEXTS.AUTH.INVITE_PENDING_TITLE}
        >
          <ButtonLink href={APP_ROUTES.SIGN_IN} variant="secondary">
            {TEXTS.AUTH.BACK_TO_SIGN_IN}
          </ButtonLink>
        </AuthFormWrapper>
      </Container>
    </Section>
  </main>
);

export default InvitePendingPage;
