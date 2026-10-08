import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../students.config";
import { Language, LanguageLevel, LearningGoal } from "../students.enums";

const { validation } = STUDENTS_CONFIG;

/** A `<select>` yields an empty string for its placeholder option. */
const optionalChoice = <TValues extends Record<string, string>>(
  values: TValues,
) => z.union([z.literal(""), z.enum(values)]);

const optionalLevel = optionalChoice(LanguageLevel);

export const studentCourseFormSchema = z.object({
  comments: z
    .string()
    .trim()
    .max(validation.commentsMaxLength, ERRORS.VALIDATION.COMMENTS_MAX_LENGTH),
  grammarLevel: optionalLevel,
  language: optionalChoice(Language).pipe(
    z.enum(Language, ERRORS.VALIDATION.LANGUAGE_REQUIRED),
  ),
  learningGoals: z
    .array(z.enum(LearningGoal))
    .min(1, ERRORS.VALIDATION.LEARNING_GOALS_REQUIRED),
  listeningLevel: optionalLevel,
  readingLevel: optionalLevel,
  speakingLevel: optionalLevel,
  specialGoal: z
    .string()
    .trim()
    .max(
      validation.specialGoalMaxLength,
      ERRORS.VALIDATION.SPECIAL_GOAL_MAX_LENGTH,
    ),
  vocabularyLevel: optionalLevel,
});

export type StudentCourseFormInput = z.input<typeof studentCourseFormSchema>;

export type StudentCourseFormValues = z.output<typeof studentCourseFormSchema>;

export const STUDENT_COURSE_FORM_DEFAULT_VALUES: StudentCourseFormInput = {
  comments: "",
  grammarLevel: "",
  language: "",
  learningGoals: [],
  listeningLevel: "",
  readingLevel: "",
  speakingLevel: "",
  specialGoal: "",
  vocabularyLevel: "",
};
