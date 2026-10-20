import { TEXTS } from "@/modules/common/constants";
import { teacherGoalsListEmptyStyles } from "./style";

export const TeacherGoalsListEmpty = () => (
  <p className={teacherGoalsListEmptyStyles.root}>{TEXTS.GOALS.EMPTY}</p>
);
