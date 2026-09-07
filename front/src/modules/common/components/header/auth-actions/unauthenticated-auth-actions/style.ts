import { cn } from "@/modules/common/utils";

export const unauthenticatedAuthActionsStyles = {
  root: (stacked: boolean) =>
    cn(
      "items-center gap-2",
      stacked ? "flex flex-col items-stretch" : "flex",
    ),
} as const;
