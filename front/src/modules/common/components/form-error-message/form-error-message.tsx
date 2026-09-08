import { formErrorMessageStyles } from "./style";
import type { FormErrorMessageProps } from "./types";

export const FormErrorMessage = ({ id, message }: FormErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className={formErrorMessageStyles.root} id={id} role="alert">
      {message}
    </p>
  );
};
