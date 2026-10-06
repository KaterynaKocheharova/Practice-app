import { Button, FormErrorMessage } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { isMissingResourceError } from "../../utils";
import { studentResourceErrorStyles } from "./style";
import type { StudentResourceErrorProps } from "./types";

/** A missing resource cannot be fixed by retrying, so only load failures get a retry button. */
export const StudentResourceError = ({
  error,
  loadFailedMessage,
  notFoundMessage,
  onRetry,
}: StudentResourceErrorProps) => {
  if (isMissingResourceError(error)) {
    return <FormErrorMessage message={notFoundMessage} />;
  }

  return (
    <div className={studentResourceErrorStyles.root}>
      <FormErrorMessage message={loadFailedMessage} />
      <Button onClick={onRetry} variant="secondary">
        {TEXTS.STUDENTS.RETRY}
      </Button>
    </div>
  );
};
