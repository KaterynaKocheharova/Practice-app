import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { parseHobbies } from "../../utils/parse-hobbies";

const { validation } = STUDENTS_CONFIG;

export const createStudentSchema = z.object({
  birthDate: z.union([
    z.literal(""),
    z.iso.date(ERRORS.VALIDATION.BIRTH_DATE_INVALID),
  ]),
  email: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.literal(""),
        z
          .email(ERRORS.VALIDATION.EMAIL_INVALID)
          .max(validation.emailMaxLength, ERRORS.VALIDATION.EMAIL_MAX_LENGTH),
      ]),
    ),
  hobbies: z
    .string()
    .refine(
      (value) => parseHobbies(value).length <= validation.hobbiesMaxCount,
      ERRORS.VALIDATION.HOBBIES_MAX_COUNT,
    )
    .refine(
      (value) =>
        parseHobbies(value).every(
          (hobby) => hobby.length <= validation.hobbyMaxLength,
        ),
      ERRORS.VALIDATION.HOBBY_MAX_LENGTH,
    ),
  job: z
    .string()
    .trim()
    .max(validation.jobMaxLength, ERRORS.VALIDATION.JOB_MAX_LENGTH),
  name: z
    .string()
    .trim()
    .min(1, ERRORS.VALIDATION.NAME_REQUIRED)
    .max(validation.nameMaxLength, ERRORS.VALIDATION.NAME_MAX_LENGTH),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export const CREATE_STUDENT_DEFAULT_VALUES: CreateStudentFormValues = {
  birthDate: "",
  email: "",
  hobbies: "",
  job: "",
  name: "",
};
