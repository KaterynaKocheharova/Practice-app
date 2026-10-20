export const teacherGoalCardStyles = {
  details: "whitespace-pre-line text-sm text-foreground",
  footer: "flex flex-wrap items-center justify-between gap-3",
  header: "flex items-start justify-between gap-3",
  meta: "text-sm text-muted-foreground",
  root: "flex flex-col gap-3",
  status: (isCompleted: boolean) =>
    isCompleted
      ? "shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
      : "shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-success",
  title: "break-words text-base font-semibold text-foreground",
} as const;
