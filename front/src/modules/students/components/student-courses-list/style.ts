export const studentCoursesListStyles = {
  empty: "text-sm text-muted-foreground",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  root: (isRefreshing: boolean) =>
    isRefreshing
      ? "flex flex-col gap-4 opacity-60 transition-opacity"
      : "flex flex-col gap-4 transition-opacity",
  status: "sr-only",
} as const;
