import { cn } from "@/modules/common/utils";

export const authenticatedAuthActionsStyles = {
  root: (stacked: boolean) =>
    cn(
      "min-w-0 items-center gap-3",
      stacked ? "flex flex-col items-stretch" : "flex",
    ),
  userText: "min-w-0 truncate text-sm text-muted-foreground",
  userValue: "font-medium text-foreground",
} as const;
