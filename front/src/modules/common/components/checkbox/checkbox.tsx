import { cn } from "@/modules/common/utils";
import { checkboxStyles } from "./style";
import type { CheckboxProps } from "./types";

export const Checkbox = ({ className, id, label, ...props }: CheckboxProps) => (
  <label className={cn(checkboxStyles.root, className)} htmlFor={id}>
    <input className={checkboxStyles.input} id={id} type="checkbox" {...props} />
    {label}
  </label>
);
