import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../students.config";
import { parseHobbies } from "../utils/parse-hobbies";

const { validation } = STUDENTS_CONFIG;

export const studentProfileFormSchema = z.object({
  birthDate: z.union([
    z.literal(""),
    z.iso.date(ERRORS.VALIDATION.BIRTH_DATE_INVALID),
  ]),
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
});

export const studentNameSchema = z
  .string()
  .trim()
  .min(1, ERRORS.VALIDATION.NAME_REQUIRED)
  .max(validation.nameMaxLength, ERRORS.VALIDATION.NAME_MAX_LENGTH);

export const studentFormSchema = studentProfileFormSchema.extend({
  name: studentNameSchema,
});

export type StudentProfileFormValues = z.infer<typeof studentProfileFormSchema>;
export type StudentFormValues = z.infer<typeof studentFormSchema>;

export const STUDENT_PROFILE_FORM_DEFAULT_VALUES: StudentProfileFormValues = {
  birthDate: "",
  hobbies: "",
  job: "",
};

export const STUDENT_FORM_DEFAULT_VALUES: StudentFormValues = {
  ...STUDENT_PROFILE_FORM_DEFAULT_VALUES,
  name: "",
};
