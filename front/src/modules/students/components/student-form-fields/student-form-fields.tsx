import { TextField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentFormFieldsStyles } from "./style";
import type { StudentFormFieldsProps } from "./types";

const { fieldIds, fields, inputTypes } = STUDENTS_CONFIG.forms.student;

/** The student fields shared by the create and edit forms. */
export const StudentFormFields = ({
  errors,
  isEmailEditable,
  register,
}: StudentFormFieldsProps) => (
  <div className={studentFormFieldsStyles.fields}>
    <div className={studentFormFieldsStyles.wideField}>
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
    </div>

    {isEmailEditable && (
      <TextField
        errorId={fieldIds.EmailError}
        errorMessage={errors.email?.message}
        id={fieldIds.Email}
        label={TEXTS.STUDENTS.EMAIL}
        optionalLabel={TEXTS.STUDENTS.OPTIONAL}
        placeholder={TEXTS.STUDENTS.EMAIL_PLACEHOLDER}
        type={inputTypes.email}
        {...register(fields.Email)}
      />
    )}

    <TextField
      errorId={fieldIds.BirthDateError}
      errorMessage={errors.birthDate?.message}
      id={fieldIds.BirthDate}
      label={TEXTS.STUDENTS.BIRTH_DATE}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      type={inputTypes.birthDate}
      {...register(fields.BirthDate)}
    />

    <TextField
      errorId={fieldIds.JobError}
      errorMessage={errors.job?.message}
      id={fieldIds.Job}
      label={TEXTS.STUDENTS.JOB}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      placeholder={TEXTS.STUDENTS.JOB_PLACEHOLDER}
      type={inputTypes.job}
      {...register(fields.Job)}
    />

    <TextField
      errorId={fieldIds.HobbiesError}
      errorMessage={errors.hobbies?.message}
      hint={TEXTS.STUDENTS.HOBBIES_HINT}
      hintId={fieldIds.HobbiesHint}
      id={fieldIds.Hobbies}
      label={TEXTS.STUDENTS.HOBBIES}
      optionalLabel={TEXTS.STUDENTS.OPTIONAL}
      placeholder={TEXTS.STUDENTS.HOBBIES_PLACEHOLDER}
      type={inputTypes.hobbies}
      {...register(fields.Hobbies)}
    />
  </div>
);
