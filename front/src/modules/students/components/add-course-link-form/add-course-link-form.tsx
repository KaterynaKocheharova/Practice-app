"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  FormErrorMessage,
  TextField,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { createCourseLinkDocumentAction } from "../../actions/course-documents-actions";
import {
  COURSE_LINK_DOCUMENT_FORM_DEFAULT_VALUES,
  courseLinkDocumentFormSchema,
  type CourseLinkDocumentFormValues,
} from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { getCourseDocumentErrorMessage } from "../../utils";
import { addCourseLinkFormStyles } from "./style";
import type { AddCourseLinkFormProps } from "./types";

const { fieldIds, fields, inputTypes } = STUDENTS_CONFIG.forms.courseDocument;
const { DOCUMENTS } = TEXTS.COURSES;

export const AddCourseLinkForm = ({
  course,
  onAdded,
}: AddCourseLinkFormProps) => {
  const { isPending, run: addLink } = useServerAction(
    createCourseLinkDocumentAction,
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<CourseLinkDocumentFormValues>({
    defaultValues: COURSE_LINK_DOCUMENT_FORM_DEFAULT_VALUES,
    resolver: zodResolver(courseLinkDocumentFormSchema),
  });

  const handleValidSubmit = async (values: CourseLinkDocumentFormValues) => {
    const result = await addLink(course, values);

    if (!result.ok) {
      const message = getCourseDocumentErrorMessage(
        result.errorCode,
        ERRORS.COURSE_DOCUMENTS.ADD_LINK_FAILED,
      );
      setError(fields.Root, { message });
      toast.error(message);
      return;
    }

    toast.success(DOCUMENTS.LINK_ADDED);
    onAdded();
  };

  return (
    <form
      className={addCourseLinkFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <h3 className={addCourseLinkFormStyles.title}>
        {DOCUMENTS.ADD_LINK_TITLE}
      </h3>
      <TextField
        errorId={fieldIds.LinkUrlError}
        errorMessage={errors.url?.message}
        id={fieldIds.LinkUrl}
        label={DOCUMENTS.URL}
        placeholder={DOCUMENTS.URL_PLACEHOLDER}
        type={inputTypes.url}
        {...register(fields.Url)}
      />
      <TextField
        errorId={fieldIds.LinkTitleError}
        errorMessage={errors.title?.message}
        id={fieldIds.LinkTitle}
        label={DOCUMENTS.TITLE_LABEL}
        placeholder={DOCUMENTS.TITLE_PLACEHOLDER}
        type={inputTypes.title}
        {...register(fields.Title)}
      />
      <FormErrorMessage message={errors[fields.Root]?.message} />
      <Button
        className={addCourseLinkFormStyles.submit}
        disabled={isPending}
        type="submit"
      >
        {isPending ? DOCUMENTS.ADDING_LINK : DOCUMENTS.ADD_LINK}
      </Button>
    </form>
  );
};
