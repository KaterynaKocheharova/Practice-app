"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api/query-client";
import type { ReactQueryProviderProps } from "./types";

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
