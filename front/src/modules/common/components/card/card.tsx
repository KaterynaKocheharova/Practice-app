import { cn } from "@/modules/common/utils";
import type { CardProps } from "./types";

export function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-bento-sm border border-border bg-card p-4 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
