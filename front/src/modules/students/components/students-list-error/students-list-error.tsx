import { Button, FormErrorMessage } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { studentsListErrorStyles } from "./style";
import type { StudentsListErrorProps } from "./types";

export const StudentsListError = ({ onRetry }: StudentsListErrorProps) => (
  <div className={studentsListErrorStyles.root}>
    <FormErrorMessage message={ERRORS.STUDENTS.LOAD_FAILED} />
    <Button onClick={onRetry} variant="secondary">
      {TEXTS.STUDENTS.RETRY}
    </Button>
  </div>
);
