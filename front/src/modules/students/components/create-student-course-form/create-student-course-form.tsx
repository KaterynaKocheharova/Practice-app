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
import { createStudentCourseAction } from "../../actions/student-courses-actions";
import {
  STUDENT_COURSE_FORM_DEFAULT_VALUES,
  studentCourseFormSchema,
  type StudentCourseFormInput,
  type StudentCourseFormValues,
} from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsErrorCode } from "../../students.enums";
import { toCreateStudentCourseRequest } from "../../utils";
import { StudentCourseFormFields } from "../student-course-form-fields/student-course-form-fields";
import { StudentCourseLanguageField } from "../student-course-language-field/student-course-language-field";
import { createStudentCourseFormStyles } from "./style";
import type { CreateStudentCourseFormProps } from "./types";

const { fields } = STUDENTS_CONFIG.forms.studentCourse;

export const CreateStudentCourseForm = ({
  availableLanguages,
  studentId,
}: CreateStudentCourseFormProps) => {
  const router = useRouter();
  const { isPending, run: createCourse } = useServerAction(
    createStudentCourseAction,
  );

  const hasNoAvailableLanguages = !availableLanguages?.length;

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<StudentCourseFormInput, unknown, StudentCourseFormValues>({
    defaultValues: STUDENT_COURSE_FORM_DEFAULT_VALUES,
    resolver: zodResolver(studentCourseFormSchema),
  });

  const handleValidSubmit = async (values: StudentCourseFormValues) => {
    const result = await createCourse(
      studentId,
      toCreateStudentCourseRequest(values),
    );

    if (result.ok) {
      toast.success(TEXTS.COURSES.COURSE_CREATED);
      router.push(APP_ROUTES.STUDENT_COURSE_DETAILS(studentId, result.data.id));
      return;
    }

    if (result.errorCode === StudentsErrorCode.CourseAlreadyExists) {
      setError(fields.Language, { message: ERRORS.COURSES.ALREADY_EXISTS });
      toast.error(ERRORS.COURSES.ALREADY_EXISTS);
      return;
    }

    setError(fields.Root, { message: ERRORS.COURSES.CREATE_FAILED });
    toast.error(ERRORS.COURSES.CREATE_FAILED);
  };

  return (
    <form
      className={createStudentCourseFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <StudentCourseFormFields
        errors={errors}
        languageField={
          <StudentCourseLanguageField
            availableLanguages={availableLanguages}
            errorMessage={errors.language?.message}
            registration={register(fields.Language)}
          />
        }
        register={register}
      />

      <FormErrorMessage message={errors[fields.Root]?.message} />

      <div className={createStudentCourseFormStyles.actions}>
        <ButtonLink
          href={APP_ROUTES.STUDENT_DETAILS(studentId)}
          variant="ghost"
        >
          {TEXTS.COURSES.CANCEL}
        </ButtonLink>
        <Button disabled={isPending || hasNoAvailableLanguages} type="submit">
          {isPending
            ? TEXTS.COURSES.CREATING_COURSE
            : TEXTS.COURSES.CREATE_COURSE}
        </Button>
      </div>
    </form>
  );
};
