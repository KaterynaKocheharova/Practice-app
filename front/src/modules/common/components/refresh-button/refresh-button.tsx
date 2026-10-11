"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../button/button";
import type { RefreshButtonProps } from "./types";

/** Re-renders the current page on the server, e.g. to retry a failed load. */
export const RefreshButton = ({ children }: RefreshButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      variant="secondary"
    >
      {children}
    </Button>
  );
};
