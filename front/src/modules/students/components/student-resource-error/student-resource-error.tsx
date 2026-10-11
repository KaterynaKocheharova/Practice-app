import {
  FormErrorMessage,
  RefreshButton,
} from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { isMissingResourceStatus } from "../../utils";
import { studentResourceErrorStyles } from "./style";
import type { StudentResourceErrorProps } from "./types";

/** A missing resource cannot be fixed by retrying, so only load failures get a retry button. */
export const StudentResourceError = ({
  loadFailedMessage,
  notFoundMessage,
  status,
}: StudentResourceErrorProps) => {
  if (isMissingResourceStatus(status)) {
    return <FormErrorMessage message={notFoundMessage} />;
  }

  return (
    <div className={studentResourceErrorStyles.root}>
      <FormErrorMessage message={loadFailedMessage} />
      <RefreshButton>{TEXTS.STUDENTS.RETRY}</RefreshButton>
    </div>
  );
};
