import type { ButtonSize, ButtonVariant } from "./types";

export const buttonStyles = {
  root: "inline-flex items-center justify-center gap-2 rounded-[var(--input-radius)] font-medium transition disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2",
  size: {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  } satisfies Record<ButtonSize, string>,
  variant: {
    primary:
      "bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-focus",
    secondary:
      "bg-accent text-accent-foreground hover:opacity-90 focus-visible:outline-focus",
    ghost:
      "bg-transparent text-foreground hover:bg-card focus-visible:outline-focus",
    danger: "bg-error text-white hover:opacity-90 focus-visible:outline-error",
  } satisfies Record<ButtonVariant, string>,
} as const;
