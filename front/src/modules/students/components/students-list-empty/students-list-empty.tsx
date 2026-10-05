import { TEXTS } from "@/modules/common/constants";
import { studentsListEmptyStyles } from "./style";

export const StudentsListEmpty = () => (
  <p className={studentsListEmptyStyles.root}>{TEXTS.STUDENTS.EMPTY}</p>
);
