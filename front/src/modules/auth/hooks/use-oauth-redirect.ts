"use client";

import { useState } from "react";
import { toast } from "sonner";

/** Leaves the app for the provider; stays pending until the page unloads. */
export const useOAuthRedirect = (failureMessage: string) => {
  const [isPending, setIsPending] = useState(false);

  const redirect = (url: string | null) => {
    if (!url) {
      toast.error(failureMessage);
      return;
    }

    setIsPending(true);
    window.location.assign(url);
  };

  return { isPending, redirect };
};
