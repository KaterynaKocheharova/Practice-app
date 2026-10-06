import type { SelectOption } from "../components/select-field/types";

/** Turns a value → label map into select options. */
export const toSelectOptions = <TValue extends string>(
  labels: Record<TValue, string>,
): SelectOption[] =>
  (Object.entries(labels) as [TValue, string][]).map(([value, label]) => ({
    disabled: false,
    label,
    value,
  }));
