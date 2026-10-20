import type { TeacherGoalFormValues } from "../schemas";
import type { CreateTeacherGoalRequest } from "../types";

export const toCreateTeacherGoalRequest = ({
  details,
  title,
}: TeacherGoalFormValues): CreateTeacherGoalRequest =>
  details ? { details, title } : { title };
