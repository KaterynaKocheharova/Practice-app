export const navLinkStyles = {
  active: "bg-background text-primary",
  root: "inline-flex h-10 items-center justify-center rounded-[var(--input-radius)] px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  variant: {
    primary: "bg-primary px-4 text-primary-foreground hover:opacity-90",
    secondary: "text-foreground hover:bg-background",
  },
} as const;
