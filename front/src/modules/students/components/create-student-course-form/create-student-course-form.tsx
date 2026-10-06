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
  TextareaField,
  TextField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import {
  useAvailableCourseLanguages,
  useCreateStudentCourse,
} from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsErrorCode } from "../../students.enums";
import { toCreateStudentCourseRequest } from "../../utils";
import { StudentCourseLanguageField } from "../student-course-language-field/student-course-language-field";
import { StudentCourseLevelFields } from "../student-course-level-fields/student-course-level-fields";
import {
  CREATE_STUDENT_COURSE_DEFAULT_VALUES,
  createStudentCourseSchema,
  type CreateStudentCourseFormInput,
  type CreateStudentCourseFormValues,
} from "./schema";
import { createStudentCourseFormStyles } from "./style";
import type { CreateStudentCourseFormProps } from "./types";

const { fieldIds, fields, inputTypes } =
  STUDENTS_CONFIG.forms.createStudentCourse;

export const CreateStudentCourseForm = ({
  studentId,
}: CreateStudentCourseFormProps) => {
  const router = useRouter();
  const { mutateAsync: createCourse, isPending } =
    useCreateStudentCourse(studentId);

  const {
    data: availableLanguages,
    isError: isLanguagesError,
    isPending: isLanguagesPending,
    refetch: refetchLanguages,
  } = useAvailableCourseLanguages(studentId);

  const hasNoAvailableLanguages = availableLanguages?.length === 0;

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<
    CreateStudentCourseFormInput,
    unknown,
    CreateStudentCourseFormValues
  >({
    defaultValues: CREATE_STUDENT_COURSE_DEFAULT_VALUES,
    resolver: zodResolver(createStudentCourseSchema),
  });

  const handleValidSubmit = async (values: CreateStudentCourseFormValues) => {
    try {
      const { id } = await createCourse(toCreateStudentCourseRequest(values));
      toast.success(TEXTS.COURSES.COURSE_CREATED);
      router.push(APP_ROUTES.STUDENT_COURSE_DETAILS(studentId, id));
    } catch (error) {
      if (getApiErrorCode(error) === StudentsErrorCode.CourseAlreadyExists) {
        setError(fields.Language, { message: ERRORS.COURSES.ALREADY_EXISTS });
        toast.error(ERRORS.COURSES.ALREADY_EXISTS);
        return;
      }

      setError(fields.Root, { message: ERRORS.COURSES.CREATE_FAILED });
      toast.error(ERRORS.COURSES.CREATE_FAILED);
    }
  };

  return (
    <form
      className={createStudentCourseFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div className={createStudentCourseFormStyles.fields}>
        <StudentCourseLanguageField
          availableLanguages={availableLanguages}
          errorMessage={errors.language?.message}
          isError={isLanguagesError}
          isPending={isLanguagesPending}
          onRetry={() => void refetchLanguages()}
          registration={register(fields.Language)}
        />

        <TextField
          errorId={fieldIds.LearningGoalError}
          errorMessage={errors.learningGoal?.message}
          id={fieldIds.LearningGoal}
          label={TEXTS.COURSES.LEARNING_GOAL}
          optionalLabel={TEXTS.COURSES.OPTIONAL}
          placeholder={TEXTS.COURSES.LEARNING_GOAL_PLACEHOLDER}
          type={inputTypes.learningGoal}
          {...register(fields.LearningGoal)}
        />

        <div className={createStudentCourseFormStyles.wideField}>
          <TextareaField
            errorId={fieldIds.SpecialGoalError}
            errorMessage={errors.specialGoal?.message}
            id={fieldIds.SpecialGoal}
            label={TEXTS.COURSES.SPECIAL_GOAL}
            optionalLabel={TEXTS.COURSES.OPTIONAL}
            placeholder={TEXTS.COURSES.SPECIAL_GOAL_PLACEHOLDER}
            {...register(fields.SpecialGoal)}
          />
        </div>

        <StudentCourseLevelFields errors={errors} register={register} />

        <div className={createStudentCourseFormStyles.wideField}>
          <TextareaField
            errorId={fieldIds.CommentsError}
            errorMessage={errors.comments?.message}
            id={fieldIds.Comments}
            label={TEXTS.COURSES.COMMENTS}
            optionalLabel={TEXTS.COURSES.OPTIONAL}
            placeholder={TEXTS.COURSES.COMMENTS_PLACEHOLDER}
            {...register(fields.Comments)}
          />
        </div>
      </div>

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
