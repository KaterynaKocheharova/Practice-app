import { FormErrorMessage } from "../form-error-message/form-error-message";
import { Label } from "../label/label";
import { Textarea } from "../textarea/textarea";
import { textareaFieldStyles } from "./style";
import type { TextareaFieldProps } from "./types";

export const TextareaField = ({
  errorId,
  errorMessage,
  id,
  label,
  optionalLabel,
  ...textareaProps
}: TextareaFieldProps) => (
  <div className={textareaFieldStyles.root}>
    <Label className={textareaFieldStyles.label} htmlFor={id}>
      {label}
      {optionalLabel && (
        <span className={textareaFieldStyles.optional}>{optionalLabel}</span>
      )}
    </Label>
    <Textarea
      aria-describedby={errorMessage ? errorId : undefined}
      aria-invalid={Boolean(errorMessage)}
      id={id}
      {...textareaProps}
    />
    <FormErrorMessage id={errorId} message={errorMessage} />
  </div>
);
