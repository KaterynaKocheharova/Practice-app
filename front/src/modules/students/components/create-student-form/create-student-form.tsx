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
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { createStudentAction } from "../../actions/students-actions";
import {
  STUDENT_FORM_DEFAULT_VALUES,
  studentFormSchema,
  type StudentFormValues,
} from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { toCreateStudentRequest } from "../../utils";
import { StudentFormFields } from "../student-form-fields/student-form-fields";
import { createStudentFormStyles } from "./style";

const { fields } = STUDENTS_CONFIG.forms.student;

export const CreateStudentForm = () => {
  const router = useRouter();
  const { isPending, run: createStudent } = useServerAction(createStudentAction);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<StudentFormValues>({
    defaultValues: STUDENT_FORM_DEFAULT_VALUES,
    resolver: zodResolver(studentFormSchema),
  });

  const handleValidSubmit = async (values: StudentFormValues) => {
    const result = await createStudent(toCreateStudentRequest(values));

    if (result.ok) {
      toast.success(TEXTS.STUDENTS.STUDENT_CREATED);
      router.push(APP_ROUTES.STUDENTS);
      return;
    }

    setError(fields.Root, { message: ERRORS.STUDENTS.CREATE_FAILED });
    toast.error(ERRORS.STUDENTS.CREATE_FAILED);
  };

  return (
    <form
      className={createStudentFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <StudentFormFields errors={errors} register={register} />

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
