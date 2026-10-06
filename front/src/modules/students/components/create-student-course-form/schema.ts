import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { Language, LanguageLevel, LearningGoal } from "../../students.enums";

const { validation } = STUDENTS_CONFIG;

/** A `<select>` yields an empty string for its placeholder option. */
const optionalChoice = <TValues extends Record<string, string>>(
  values: TValues,
) => z.union([z.literal(""), z.enum(values)]);

const optionalLevel = optionalChoice(LanguageLevel);

export const createStudentCourseSchema = z.object({
  comments: z
    .string()
    .trim()
    .max(validation.commentsMaxLength, ERRORS.VALIDATION.COMMENTS_MAX_LENGTH),
  grammarLevel: optionalLevel,
  language: optionalChoice(Language).pipe(
    z.enum(Language, ERRORS.VALIDATION.LANGUAGE_REQUIRED),
  ),
  learningGoal: optionalChoice(LearningGoal),
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

export type CreateStudentCourseFormInput = z.input<
  typeof createStudentCourseSchema
>;

export type CreateStudentCourseFormValues = z.output<
  typeof createStudentCourseSchema
>;

export const CREATE_STUDENT_COURSE_DEFAULT_VALUES: CreateStudentCourseFormInput =
  {
    comments: "",
    grammarLevel: "",
    language: "",
    learningGoal: "",
    listeningLevel: "",
    readingLevel: "",
    speakingLevel: "",
    specialGoal: "",
    vocabularyLevel: "",
  };
