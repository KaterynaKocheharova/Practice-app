import { TEXTS } from "@/modules/common/constants";
import { Container } from "../container/container";
import { Loader } from "../loader/loader";
import { Section } from "../section/section";
import { pageLoaderStyles } from "./style";

export const PageLoader = () => (
  <Section>
    <Container>
      <div
        aria-busy="true"
        aria-live="polite"
        className={pageLoaderStyles.panel}
      >
        <Loader className={pageLoaderStyles.loader} />
        <h1 className={pageLoaderStyles.title}>
          {TEXTS.ROUTE_STATUS.LOADING_TITLE}
        </h1>
        <p className={pageLoaderStyles.description}>
          {TEXTS.ROUTE_STATUS.LOADING_DESCRIPTION}
        </p>
      </div>
    </Container>
  </Section>
);
