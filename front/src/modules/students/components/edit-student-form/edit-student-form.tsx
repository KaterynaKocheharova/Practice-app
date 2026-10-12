"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  ButtonLink,
  FormErrorMessage,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { updateStudentAction } from "../../actions/students-actions";
import { studentFormSchema, type StudentFormValues } from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsErrorCode } from "../../students.enums";
import { toStudentFormValues, toUpdateStudentRequest } from "../../utils";
import { StudentFormFields } from "../student-form-fields/student-form-fields";
import { editStudentFormStyles } from "./style";
import type { EditStudentFormProps } from "./types";

const { fields } = STUDENTS_CONFIG.forms.student;

/** Shared by the creating teacher and the student; neither edits the email. */
export const EditStudentForm = ({
  returnHref,
  student,
}: EditStudentFormProps) => {
  const router = useRouter();
  const { isPending, run: updateStudent } =
    useServerAction(updateStudentAction);
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
    const result = await updateStudent(
      student.id,
      toUpdateStudentRequest(values),
    );

    if (result.ok) {
      toast.success(TEXTS.STUDENTS.STUDENT_UPDATED);
      router.push(returnHref);
      return;
    }

    const message =
      result.errorCode === StudentsErrorCode.StudentNotEditable
        ? ERRORS.STUDENTS.NOT_EDITABLE
        : ERRORS.STUDENTS.UPDATE_FAILED;

    setError(fields.Root, { message });
    toast.error(message);
  };

  return (
    <form
      className={editStudentFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <StudentFormFields errors={errors} register={register} />

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
