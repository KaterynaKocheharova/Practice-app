import { SignInVerificationStatus } from "@/modules/auth/components";
import { Container, Section } from "@/modules/common/components";
import { verifySigninPageStyles } from "./style";
import type { VerifySigninPageProps } from "./types";

const VerifySigninPage = async ({
  searchParams,
}: VerifySigninPageProps) => {
  const token = (await searchParams).token;

  return (
    <main className={verifySigninPageStyles.main}>
      <Section className={verifySigninPageStyles.section}>
        <Container>
          <SignInVerificationStatus
            token={typeof token === "string" ? token : undefined}
          />
        </Container>
      </Section>
    </main>
  );
};

export default VerifySigninPage;
