import { cn } from "@/modules/common/utils";
import { selectStyles } from "./style";
import type { SelectProps } from "./types";

export const Select = ({ className, ...props }: SelectProps) => (
  <select className={cn(selectStyles.root, className)} {...props} />
);
