"use client";

import { toast } from "sonner";
import type { ServerApiResponse } from "../api";
import { useServerAction } from "./use-server-action";

export interface ServerActionToastOptions {
  getErrorMessage: (errorCode: string | null) => string;
  successMessage: string;
}

export const useServerActionToast = <TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<ServerApiResponse<TData>>,
  { getErrorMessage, successMessage }: ServerActionToastOptions,
) => {
  const { isPending, run: runAction } = useServerAction(action);

  const run = async (...args: TArgs): Promise<boolean> => {
    const result = await runAction(...args);

    if (!result.ok) {
      toast.error(getErrorMessage(result.errorCode));
      return false;
    }

    toast.success(successMessage);
    return true;
  };

  return { isPending, run };
};
