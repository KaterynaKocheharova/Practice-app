import type { ComponentProps } from "react";
import { cn } from "@/modules/common/utils";

type WrapperProps = ComponentProps<"div">;

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
