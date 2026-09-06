import type { ComponentProps } from "react";
import { cn } from "@/modules/common/utils";

type InputProps = ComponentProps<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-error aria-invalid:focus:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}
