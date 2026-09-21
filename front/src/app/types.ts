import type { ReactNode } from "react";

export interface RootLayoutProps {
  children: ReactNode;
}

type ErrorDigest = {
  digest: string;
};

export type RouteError = Error | (Error & ErrorDigest);

export interface RouteErrorPageProps {
  error: RouteError;
  retry: () => void;
}
