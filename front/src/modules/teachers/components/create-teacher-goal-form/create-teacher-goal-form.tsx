"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  FormErrorMessage,
  TextareaField,
  TextField,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { createTeacherGoalAction } from "../../actions/teacher-goals-actions";
import {
  TEACHER_GOAL_FORM_DEFAULT_VALUES,
  teacherGoalFormSchema,
  type TeacherGoalFormValues,
} from "../../schemas";
import { TEACHERS_CONFIG } from "../../teachers.config";
import {
  getTeacherGoalErrorMessage,
  toCreateTeacherGoalRequest,
} from "../../utils";
import { createTeacherGoalFormStyles } from "./style";
import type { CreateTeacherGoalFormProps } from "./types";

const { fieldIds, fields, inputTypes } = TEACHERS_CONFIG.forms.goal;
const { GOALS } = TEXTS;

export const CreateTeacherGoalForm = ({
  onAdded,
}: CreateTeacherGoalFormProps) => {
  const { isPending, run: createGoal } = useServerAction(
    createTeacherGoalAction,
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TeacherGoalFormValues>({
    defaultValues: TEACHER_GOAL_FORM_DEFAULT_VALUES,
    resolver: zodResolver(teacherGoalFormSchema),
  });

  const handleValidSubmit = async (values: TeacherGoalFormValues) => {
    const result = await createGoal(toCreateTeacherGoalRequest(values));

    if (!result.ok) {
      const message = getTeacherGoalErrorMessage(
        result.errorCode,
        ERRORS.TEACHER_GOALS.CREATE_FAILED,
      );
      setError(fields.Root, { message });
      toast.error(message);
      return;
    }

    toast.success(GOALS.GOAL_ADDED);
    onAdded();
  };

  return (
    <form
      className={createTeacherGoalFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <TextField
        errorId={fieldIds.TitleError}
        errorMessage={errors.title?.message}
        id={fieldIds.Title}
        label={GOALS.TITLE_LABEL}
        placeholder={GOALS.TITLE_PLACEHOLDER}
        type={inputTypes.title}
        {...register(fields.Title)}
      />
      <TextareaField
        errorId={fieldIds.DetailsError}
        errorMessage={errors.details?.message}
        id={fieldIds.Details}
        label={GOALS.DETAILS}
        optionalLabel={GOALS.OPTIONAL}
        placeholder={GOALS.DETAILS_PLACEHOLDER}
        {...register(fields.Details)}
      />
      <FormErrorMessage message={errors[fields.Root]?.message} />
      <Button
        className={createTeacherGoalFormStyles.submit}
        disabled={isPending}
        type="submit"
      >
        {isPending ? GOALS.ADDING_GOAL : GOALS.ADD_GOAL}
      </Button>
    </form>
  );
};
