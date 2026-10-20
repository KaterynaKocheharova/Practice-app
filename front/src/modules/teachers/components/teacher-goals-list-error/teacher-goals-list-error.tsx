import {
  FormErrorMessage,
  RefreshButton,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { teacherGoalsListErrorStyles } from "./style";

export const TeacherGoalsListError = () => (
  <div className={teacherGoalsListErrorStyles.root}>
    <FormErrorMessage message={ERRORS.TEACHER_GOALS.LOAD_FAILED} />
    <RefreshButton>{TEXTS.GOALS.RETRY}</RefreshButton>
  </div>
);
