import { cn } from "@/modules/common/utils";
import type { TextareaProps } from "./types";

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-[var(--input-radius)] border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-error aria-invalid:focus:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}
