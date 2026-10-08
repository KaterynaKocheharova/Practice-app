import { Checkbox } from "../checkbox/checkbox";
import { checkboxListStyles } from "./style";
import type { CheckboxListProps } from "./types";

export const CheckboxList = ({
  idPrefix,
  options,
  ...inputProps
}: CheckboxListProps) => (
  <div className={checkboxListStyles.root}>
    {options.map(({ disabled, label, value }) => (
      <Checkbox
        disabled={disabled}
        id={`${idPrefix}-${value}`}
        key={value}
        label={label}
        value={value}
        {...inputProps}
      />
    ))}
  </div>
);
