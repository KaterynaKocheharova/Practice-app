import { cn } from "@/modules/common/utils";
import type { SectionProps } from "./types";

export function Section({ className, ...props }: SectionProps) {
  return (
    <section className={cn("py-8 sm:py-10 lg:py-12", className)} {...props} />
  );
}
