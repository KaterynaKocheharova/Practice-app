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
import { useUpdateStudentCourse } from "../../hooks";
import {
  studentCourseFormSchema,
  type StudentCourseFormInput,
  type StudentCourseFormValues,
} from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import {
  toStudentCourseFormValues,
  toUpdateStudentCourseRequest,
} from "../../utils";
import { StudentCourseFormFields } from "../student-course-form-fields/student-course-form-fields";
import { editStudentCourseFormStyles } from "./style";
import type { EditStudentCourseFormProps } from "./types";

const { fields } = STUDENTS_CONFIG.forms.studentCourse;

export const EditStudentCourseForm = ({
  course,
  studentId,
}: EditStudentCourseFormProps) => {
  const router = useRouter();
  const detailsHref = APP_ROUTES.STUDENT_COURSE_DETAILS(studentId, course.id);
  const { mutateAsync: updateCourse, isPending } = useUpdateStudentCourse({
    courseId: course.id,
    studentId,
  });
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<StudentCourseFormInput, unknown, StudentCourseFormValues>({
    defaultValues: toStudentCourseFormValues(course),
    resolver: zodResolver(studentCourseFormSchema),
  });

  const handleValidSubmit = async (values: StudentCourseFormValues) => {
    try {
      await updateCourse(toUpdateStudentCourseRequest(values));
      toast.success(TEXTS.COURSES.COURSE_UPDATED);
      router.push(detailsHref);
    } catch {
      setError(fields.Root, { message: ERRORS.COURSES.UPDATE_FAILED });
      toast.error(ERRORS.COURSES.UPDATE_FAILED);
    }
  };

  return (
    <form
      className={editStudentCourseFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <StudentCourseFormFields errors={errors} register={register} />

      <FormErrorMessage message={errors[fields.Root]?.message} />

      <div className={editStudentCourseFormStyles.actions}>
        <ButtonLink href={detailsHref} variant="ghost">
          {TEXTS.COURSES.CANCEL}
        </ButtonLink>
        <Button disabled={isPending} type="submit">
          {isPending
            ? TEXTS.COURSES.SAVING_CHANGES
            : TEXTS.COURSES.SAVE_CHANGES}
        </Button>
      </div>
    </form>
  );
};
