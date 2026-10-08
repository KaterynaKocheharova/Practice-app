import type { CheckboxListProps } from "../checkbox-list/types";

export interface CheckboxGroupFieldProps extends Omit<
  CheckboxListProps,
  "idPrefix"
> {
  errorId?: string;
  errorMessage?: string;
  /** Prefix for the checkbox ids. */
  id: string;
  label: string;
}
