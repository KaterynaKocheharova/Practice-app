import { CheckboxList } from "../checkbox-list/checkbox-list";
import { FormErrorMessage } from "../form-error-message/form-error-message";
import { checkboxGroupFieldStyles } from "./style";
import type { CheckboxGroupFieldProps } from "./types";

export const CheckboxGroupField = ({
  errorId,
  errorMessage,
  id,
  label,
  options,
  ...inputProps
}: CheckboxGroupFieldProps) => (
  <fieldset
    aria-describedby={errorMessage ? errorId : undefined}
    aria-invalid={Boolean(errorMessage)}
    className={checkboxGroupFieldStyles.root}
  >
    <legend className={checkboxGroupFieldStyles.legend}>{label}</legend>
    <CheckboxList idPrefix={id} options={options} {...inputProps} />
    <FormErrorMessage id={errorId} message={errorMessage} />
  </fieldset>
);
