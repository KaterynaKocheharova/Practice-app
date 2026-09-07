export const headerStyles = {
  container: "flex h-16 items-center justify-between gap-4",
  root: "sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur",
} as const;

export const navLinkStyles = {
  root: "inline-flex h-10 items-center justify-center rounded-[var(--input-radius)] px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  variant: {
    primary: "bg-primary px-4 text-primary-foreground hover:opacity-90",
    secondary: "text-foreground hover:bg-background",
  },
} as const;

export const sidebarLinkStyles = {
  root: "flex h-11 items-center rounded-[var(--input-radius)] px-3 text-sm font-medium text-foreground transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
} as const;
