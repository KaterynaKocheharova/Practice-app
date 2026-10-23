export const teacherGoalStatusFilterStyles = {
  root: (isFiltering: boolean) =>
    isFiltering
      ? "w-full opacity-60 transition-opacity sm:max-w-xs"
      : "w-full transition-opacity sm:max-w-xs",
} as const;
