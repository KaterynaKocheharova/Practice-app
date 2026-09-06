import type { ComponentProps } from "react";
import { cn } from "@/modules/common/utils";

type CardProps = ComponentProps<"article">;

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
