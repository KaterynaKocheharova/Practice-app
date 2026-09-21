import { Container, Loader, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { routeStatusStyles } from "./style";

const LoadingPage = () => (
  <Section>
    <Container>
      <div
        aria-busy="true"
        aria-live="polite"
        className={routeStatusStyles.panel}
      >
        <Loader className="h-12 w-12 rounded-full" />
        <h1 className={routeStatusStyles.title}>
          {TEXTS.ROUTE_STATUS.LOADING_TITLE}
        </h1>
        <p className={routeStatusStyles.description}>
          {TEXTS.ROUTE_STATUS.LOADING_DESCRIPTION}
        </p>
      </div>
    </Container>
  </Section>
);

export default LoadingPage;
