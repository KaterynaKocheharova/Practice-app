export const teacherGoalCardStyles = {
  content: "flex min-w-0 flex-1 flex-col gap-3",
  details: "whitespace-pre-line text-sm text-foreground",
  header: "flex flex-col items-start gap-1.5",
  meta: "text-sm text-muted-foreground",
  root: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
  status: (isCompleted: boolean) =>
    isCompleted
      ? "shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
      : "shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-success",
  title: "break-words text-base font-semibold text-foreground",
} as const;
