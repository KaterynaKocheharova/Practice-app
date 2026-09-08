import { cn } from "@/modules/common/utils";
import type { LabelProps } from "./types";

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
