import type { ComponentProps } from "react";
import { cn } from "@/modules/common/utils";

type SectionProps = ComponentProps<"section">;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section className={cn("py-8 sm:py-10 lg:py-12", className)} {...props} />
  );
}
