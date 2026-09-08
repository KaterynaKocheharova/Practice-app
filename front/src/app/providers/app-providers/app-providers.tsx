"use client";

import { ReactQueryProvider } from "../react-query-provider/react-query-provider";
import { ToasterProvider } from "../toaster-provider/toaster-provider";
import type { AppProvidersProps } from "./types";

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      {children}
      <ToasterProvider />
    </ReactQueryProvider>
  );
}
