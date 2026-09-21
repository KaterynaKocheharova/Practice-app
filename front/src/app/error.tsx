"use client";

import { Button, Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { routeStatusStyles } from "./style";
import type { RouteErrorPageProps } from "./types";

const ErrorPage = ({ error, retry }: RouteErrorPageProps) => (
  <Section>
    <Container>
      <div className={routeStatusStyles.panel} role="alert">
        <h1 className={routeStatusStyles.title}>
          {TEXTS.ROUTE_STATUS.ERROR_TITLE}
        </h1>
        <p className={routeStatusStyles.description}>
          {TEXTS.ROUTE_STATUS.ERROR_DESCRIPTION}
        </p>
        <p className={routeStatusStyles.details}>
          <span className={routeStatusStyles.detailsLabel}>
            {TEXTS.ROUTE_STATUS.ERROR_DETAILS_LABEL}
          </span>
          {error.message}
        </p>
        <div className={routeStatusStyles.actions}>
          <Button onClick={retry}>{TEXTS.ROUTE_STATUS.ERROR_ACTION}</Button>
        </div>
      </div>
    </Container>
  </Section>
);

export default ErrorPage;
