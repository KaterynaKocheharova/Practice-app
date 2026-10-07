"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRole } from "@/modules/auth/auth.enums";
import { getApiErrorCode } from "@/modules/common/api";
import {
  Button,
  ButtonLink,
  FormErrorMessage,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useUpdateStudent } from "../../hooks";
import { studentFormSchema, type StudentFormValues } from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsErrorCode } from "../../students.enums";
import {
  toStudentFormValues,
  toUpdateManagedStudentRequest,
  toUpdateStudentProfileRequest,
} from "../../utils";
import { StudentFormFields } from "../student-form-fields/student-form-fields";
import { editStudentFormStyles } from "./style";
import type { EditStudentFormProps } from "./types";

const { fields } = STUDENTS_CONFIG.forms.student;

/** A student cannot change their email: it belongs to their own account. */
export const EditStudentForm = ({
  returnHref,
  student,
  viewerRole,
}: EditStudentFormProps) => {
  const router = useRouter();
  const isTeacher = viewerRole === UserRole.Teacher;
  const toRequest = isTeacher
    ? toUpdateManagedStudentRequest
    : toUpdateStudentProfileRequest;
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent(
    student.id,
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<StudentFormValues>({
    defaultValues: toStudentFormValues(student),
    resolver: zodResolver(studentFormSchema),
  });

  const handleValidSubmit = async (values: StudentFormValues) => {
    try {
      await updateStudent(toRequest(values));
      toast.success(TEXTS.STUDENTS.STUDENT_UPDATED);
      router.push(returnHref);
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === StudentsErrorCode.EmailAlreadyExists) {
        setError(fields.Email, {
          message: ERRORS.STUDENTS.EMAIL_ALREADY_EXISTS,
        });
        toast.error(ERRORS.STUDENTS.EMAIL_ALREADY_EXISTS);
        return;
      }

      const message =
        errorCode === StudentsErrorCode.StudentNotEditable
          ? ERRORS.STUDENTS.NOT_EDITABLE
          : ERRORS.STUDENTS.UPDATE_FAILED;

      setError(fields.Root, { message });
      toast.error(message);
    }
  };

  return (
    <form
      className={editStudentFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <StudentFormFields
        errors={errors}
        isEmailEditable={isTeacher}
        register={register}
      />

      <FormErrorMessage message={errors[fields.Root]?.message} />

      <div className={editStudentFormStyles.actions}>
        <ButtonLink href={returnHref} variant="ghost">
          {TEXTS.STUDENTS.CANCEL}
        </ButtonLink>
        <Button disabled={isPending} type="submit">
          {isPending
            ? TEXTS.STUDENTS.SAVING_CHANGES
            : TEXTS.STUDENTS.SAVE_CHANGES}
        </Button>
      </div>
    </form>
  );
};
