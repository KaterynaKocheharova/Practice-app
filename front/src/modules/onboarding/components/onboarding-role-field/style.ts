export const onboardingRoleFieldStyles = {
  legend: "text-sm font-medium text-foreground",
  option:
    "flex h-11 flex-1 cursor-pointer items-center gap-2 rounded-[var(--input-radius)] border border-border bg-card px-3 transition hover:border-primary has-checked:border-primary has-checked:bg-primary/10",
  optionLabel: "text-sm font-medium text-foreground",
  options: "grid grid-cols-2 gap-2",
  radio:
    "size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  root: "flex flex-col gap-2",
} as const;
