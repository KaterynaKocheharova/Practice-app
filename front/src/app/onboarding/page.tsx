import { AuthFormWrapper } from "@/modules/auth/components";
import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { requireOnboardingUserServer } from "@/modules/onboarding/api/require-onboarding-user-server";
import { OnboardingForm } from "@/modules/onboarding/components";
import { onboardingPageStyles } from "./style";

const OnboardingPage = async () => {
  const currentUser = await requireOnboardingUserServer();

  return (
    <main className={onboardingPageStyles.main}>
      <Section className={onboardingPageStyles.section}>
        <Container>
          <AuthFormWrapper
            description={TEXTS.ONBOARDING.DESCRIPTION}
            title={TEXTS.ONBOARDING.TITLE}
          >
            <OnboardingForm name={currentUser.name} />
          </AuthFormWrapper>
        </Container>
      </Section>
    </main>
  );
};

export default OnboardingPage;
