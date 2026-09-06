"use client";

import type { ReactNode } from "react";
import { ReactQueryProvider } from "./react-query-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
