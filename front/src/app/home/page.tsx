import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { homePageStyles } from "./style";

const HomePage = () => (
  <main className={homePageStyles.main}>
    <Section className={homePageStyles.section}>
      <Container>
        <h1 className={homePageStyles.title}>
          {TEXTS.NAVIGATION.HOME}
        </h1>
      </Container>
    </Section>
  </main>
);

export default HomePage;
