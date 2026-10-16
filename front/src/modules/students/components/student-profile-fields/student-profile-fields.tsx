import { TextField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentProfileFieldsStyles } from "./style";
import type { StudentProfileFieldsProps } from "./types";

const { fieldIds, inputTypes } = STUDENTS_CONFIG.forms.student;

export const StudentProfileFields = ({
  errorMessages,
  inputProps,
}: StudentProfileFieldsProps) => (
  <div className={studentProfileFieldsStyles.fields}>
    <TextField
      errorId={fieldIds.BirthDateError}
      errorMessage={errorMessages.birthDate}
      id={fieldIds.BirthDate}
      label={TEXTS.STUDENTS.BIRTH_DATE}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      type={inputTypes.birthDate}
      {...inputProps.birthDate}
    />

    <TextField
      errorId={fieldIds.JobError}
      errorMessage={errorMessages.job}
      id={fieldIds.Job}
      label={TEXTS.STUDENTS.JOB}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      placeholder={TEXTS.STUDENTS.JOB_PLACEHOLDER}
      type={inputTypes.job}
      {...inputProps.job}
    />

    <TextField
      errorId={fieldIds.HobbiesError}
      errorMessage={errorMessages.hobbies}
      hint={TEXTS.STUDENTS.HOBBIES_HINT}
      hintId={fieldIds.HobbiesHint}
      id={fieldIds.Hobbies}
      label={TEXTS.STUDENTS.HOBBIES}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      placeholder={TEXTS.STUDENTS.HOBBIES_PLACEHOLDER}
      type={inputTypes.hobbies}
      {...inputProps.hobbies}
    />
  </div>
);
