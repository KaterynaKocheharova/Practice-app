"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorCode } from "@/modules/common/api";
import {
  Button,
  ButtonLink,
  FormErrorMessage,
  TextField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { useCreateStudent } from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsErrorCode } from "../../students.enums";
import { toCreateStudentRequest } from "../../utils";
import {
  CREATE_STUDENT_DEFAULT_VALUES,
  createStudentSchema,
  type CreateStudentFormValues,
} from "./schema";
import { createStudentFormStyles } from "./style";

export const CreateStudentForm = () => {
  const { fieldIds, fields, inputTypes } = STUDENTS_CONFIG.forms.createStudent;
  const router = useRouter();
  const { mutateAsync: createStudent, isPending } = useCreateStudent();
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateStudentFormValues>({
    defaultValues: CREATE_STUDENT_DEFAULT_VALUES,
    resolver: zodResolver(createStudentSchema),
  });

  const handleValidSubmit = async (values: CreateStudentFormValues) => {
    try {
      await createStudent(toCreateStudentRequest(values));
      toast.success(TEXTS.STUDENTS.STUDENT_CREATED);
      router.push(APP_ROUTES.STUDENTS);
    } catch (error) {
      if (getApiErrorCode(error) === StudentsErrorCode.EmailAlreadyExists) {
        setError(fields.Email, {
          message: ERRORS.STUDENTS.EMAIL_ALREADY_EXISTS,
        });
        toast.error(ERRORS.STUDENTS.EMAIL_ALREADY_EXISTS);
        return;
      }

      setError(fields.Root, { message: ERRORS.STUDENTS.CREATE_FAILED });
      toast.error(ERRORS.STUDENTS.CREATE_FAILED);
    }
  };

  return (
    <form
      className={createStudentFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div className={createStudentFormStyles.fields}>
        <div className={createStudentFormStyles.wideField}>
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

      <FormErrorMessage message={errors[fields.Root]?.message} />

      <div className={createStudentFormStyles.actions}>
        <ButtonLink href={APP_ROUTES.STUDENTS} variant="ghost">
          {TEXTS.STUDENTS.CANCEL}
        </ButtonLink>
        <Button disabled={isPending} type="submit">
          {isPending
            ? TEXTS.STUDENTS.CREATING_STUDENT
            : TEXTS.STUDENTS.CREATE_STUDENT}
        </Button>
      </div>
    </form>
  );
};
