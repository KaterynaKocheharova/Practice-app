"use client";

import { useTransition } from "react";
import type { ServerApiFailure, ServerApiResponse } from "../api";

const UNREACHABLE_SERVER: ServerApiFailure = {
  errorCode: null,
  ok: false,
  status: null,
};

/**
 * Runs a server action inside a transition: `isPending` stays true until the
 * action and the page refresh it triggers have finished. A network failure
 * resolves as a failed result, so callers only branch on `result.ok`.
 */
export const useServerAction = <TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<ServerApiResponse<TData>>,
) => {
  const [isPending, startTransition] = useTransition();

  const run = (...args: TArgs): Promise<ServerApiResponse<TData>> =>
    new Promise((resolve) => {
      startTransition(async () => {
        try {
          resolve(await action(...args));
        } catch {
          resolve(UNREACHABLE_SERVER);
        }
      });
    });

  return { isPending, run };
};
