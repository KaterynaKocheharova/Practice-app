import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
}
