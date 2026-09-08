import { cn } from "@/modules/common/utils";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./types";

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-focus",
  secondary:
    "bg-accent text-accent-foreground hover:opacity-90 focus-visible:outline-focus",
  ghost:
    "bg-transparent text-foreground hover:bg-card focus-visible:outline-focus",
  danger: "bg-error text-white hover:opacity-90 focus-visible:outline-error",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--input-radius)] font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
