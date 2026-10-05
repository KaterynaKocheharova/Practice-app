import { FormErrorMessage } from "../form-error-message/form-error-message";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { textFieldStyles } from "./style";
import type { TextFieldProps } from "./types";

export const TextField = ({
  errorId,
  errorMessage,
  hint,
  hintId,
  id,
  label,
  optionalLabel,
  ...inputProps
}: TextFieldProps) => {
  const describedBy = [hint ? hintId : undefined, errorMessage ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={textFieldStyles.root}>
      <Label className={textFieldStyles.label} htmlFor={id}>
        {label}
        {optionalLabel && (
          <span className={textFieldStyles.optional}>{optionalLabel}</span>
        )}
      </Label>
      <Input
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(errorMessage)}
        id={id}
        {...inputProps}
      />
      {hint && (
        <p className={textFieldStyles.hint} id={hintId}>
          {hint}
        </p>
      )}
      <FormErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
};
