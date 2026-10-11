import {
  FormErrorMessage,
  RefreshButton,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { studentsListErrorStyles } from "./style";

export const StudentsListError = () => (
  <div className={studentsListErrorStyles.root}>
    <FormErrorMessage message={ERRORS.STUDENTS.LOAD_FAILED} />
    <RefreshButton>{TEXTS.STUDENTS.RETRY}</RefreshButton>
  </div>
);
