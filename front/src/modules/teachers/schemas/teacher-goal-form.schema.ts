import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { TEACHERS_CONFIG } from "../teachers.config";

const { validation } = TEACHERS_CONFIG;

export const teacherGoalFormSchema = z.object({
  details: z
    .string()
    .trim()
    .max(validation.goalDetailsMaxLength, ERRORS.VALIDATION.GOAL_DETAILS_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(1, ERRORS.VALIDATION.GOAL_TITLE_REQUIRED)
    .max(validation.goalTitleMaxLength, ERRORS.VALIDATION.GOAL_TITLE_MAX_LENGTH),
});

export type TeacherGoalFormValues = z.output<typeof teacherGoalFormSchema>;

export const TEACHER_GOAL_FORM_DEFAULT_VALUES: TeacherGoalFormValues = {
  details: "",
  title: "",
};
