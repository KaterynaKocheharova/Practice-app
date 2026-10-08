import type { CheckboxProps } from "../checkbox/types";
import type { SelectOption } from "../select-field/types";

export interface CheckboxListProps extends Omit<
  CheckboxProps,
  "disabled" | "id" | "label" | "value"
> {
  idPrefix: string;
  options: SelectOption[];
}
