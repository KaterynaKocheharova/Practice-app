import { SignUpVerificationStatus } from "@/modules/auth/components";
import { Container, Section } from "@/modules/common/components";
import { verifySignupPageStyles } from "./style";
import type { VerifySignupPageProps } from "./types";

const VerifySignupPage = async ({
  searchParams,
}: VerifySignupPageProps) => {
  const token = (await searchParams).token;

  return (
    <main className={verifySignupPageStyles.main}>
      <Section className={verifySignupPageStyles.section}>
        <Container>
          <SignUpVerificationStatus
            token={typeof token === "string" ? token : undefined}
          />
        </Container>
      </Section>
    </main>
  );
};

export default VerifySignupPage;
