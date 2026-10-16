import { TextField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentProfileFields } from "../student-profile-fields/student-profile-fields";
import { studentFormFieldsStyles } from "./style";
import type { StudentFormFieldsProps } from "./types";

const { fieldIds, fields, inputTypes } = STUDENTS_CONFIG.forms.student;

/** The student fields shared by the create and edit forms. */
export const StudentFormFields = ({
  errors,
  register,
}: StudentFormFieldsProps) => (
  <div className={studentFormFieldsStyles.fields}>
    <TextField
      errorId={fieldIds.NameError}
      errorMessage={errors.name?.message}
      id={fieldIds.Name}
      label={TEXTS.STUDENTS.NAME}
      placeholder={TEXTS.STUDENTS.NAME_PLACEHOLDER}
      required
      type={inputTypes.name}
      {...register(fields.Name)}
    />

    <StudentProfileFields
      errorMessages={{
        birthDate: errors.birthDate?.message,
        hobbies: errors.hobbies?.message,
        job: errors.job?.message,
      }}
      inputProps={{
        birthDate: register(fields.BirthDate),
        hobbies: register(fields.Hobbies),
        job: register(fields.Job),
      }}
    />
  </div>
);
