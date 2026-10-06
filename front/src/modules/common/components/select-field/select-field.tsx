import { FormErrorMessage } from "../form-error-message/form-error-message";
import { Label } from "../label/label";
import { Select } from "../select/select";
import { selectFieldStyles } from "./style";
import type { SelectFieldProps } from "./types";

export const SelectField = ({
  errorId,
  errorMessage,
  id,
  label,
  optionalLabel,
  options,
  placeholder,
  ...selectProps
}: SelectFieldProps) => (
  <div className={selectFieldStyles.root}>
    <Label className={selectFieldStyles.label} htmlFor={id}>
      {label}
      {optionalLabel && (
        <span className={selectFieldStyles.optional}>{optionalLabel}</span>
      )}
    </Label>
    <Select
      aria-describedby={errorMessage ? errorId : undefined}
      aria-invalid={Boolean(errorMessage)}
      id={id}
      {...selectProps}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(({ disabled, label: optionLabel, value }) => (
        <option disabled={disabled} key={value} value={value}>
          {optionLabel}
        </option>
      ))}
    </Select>
    <FormErrorMessage id={errorId} message={errorMessage} />
  </div>
);
