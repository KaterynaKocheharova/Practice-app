import { cn } from "@/modules/common/utils";
import type { WrapperProps } from "./types";

export function Wrapper({ className, ...props }: WrapperProps) {
  return (
    <div
      className={cn(
        "rounded-bento border border-border bg-card p-4 shadow-bento sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
