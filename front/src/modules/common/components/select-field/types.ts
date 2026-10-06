import type { SelectProps } from "../select/types";

export interface SelectOption {
  disabled: boolean;
  label: string;
  value: string;
}

export interface SelectFieldProps extends Omit<SelectProps, "children" | "id"> {
  errorId?: string;
  errorMessage?: string;
  id: string;
  label: string;
  optionalLabel?: string;
  options: SelectOption[];
  /** Label of the empty first option; omit to require a choice from `options`. */
  placeholder?: string;
}
