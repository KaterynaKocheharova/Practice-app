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
import { useUploadCourseDocument } from "../../hooks";
import {
  COURSE_FILE_DOCUMENT_FORM_DEFAULT_VALUES,
  courseFileDocumentFormSchema,
  type CourseFileDocumentFormInput,
  type CourseFileDocumentFormValues,
} from "../../schemas";
import { STUDENTS_CONFIG } from "../../students.config";
import { getCourseDocumentErrorMessage } from "../../utils";
import { uploadCourseDocumentFormStyles } from "./style";
import type { UploadCourseDocumentFormProps } from "./types";

const { fieldIds, fields, inputTypes } = STUDENTS_CONFIG.forms.courseDocument;
const { DOCUMENTS } = TEXTS.COURSES;

export const UploadCourseDocumentForm = ({
  course,
  onAdded,
}: UploadCourseDocumentFormProps) => {
  const { mutateAsync: uploadDocument, isPending } =
    useUploadCourseDocument(course);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<
    CourseFileDocumentFormInput,
    unknown,
    CourseFileDocumentFormValues
  >({
    defaultValues: COURSE_FILE_DOCUMENT_FORM_DEFAULT_VALUES,
    resolver: zodResolver(courseFileDocumentFormSchema),
  });

  const handleValidSubmit = async (values: CourseFileDocumentFormValues) => {
    try {
      await uploadDocument(values);
      toast.success(DOCUMENTS.FILE_UPLOADED);
      onAdded();
    } catch (error) {
      const message = getCourseDocumentErrorMessage(
        error,
        ERRORS.COURSE_DOCUMENTS.UPLOAD_FAILED,
      );
      setError(fields.Root, { message });
      toast.error(message);
    }
  };

  return (
    <form
      className={uploadCourseDocumentFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <h3 className={uploadCourseDocumentFormStyles.title}>
        {DOCUMENTS.UPLOAD_TITLE}
      </h3>
      <TextField
        accept={STUDENTS_CONFIG.documents.accept}
        className={uploadCourseDocumentFormStyles.fileInput}
        errorId={fieldIds.FileError}
        errorMessage={errors.file?.message}
        hint={DOCUMENTS.FILE_HINT}
        hintId={fieldIds.FileHint}
        id={fieldIds.File}
        label={DOCUMENTS.FILE}
        type={inputTypes.file}
        {...register(fields.File)}
      />
      <TextField
        errorId={fieldIds.FileTitleError}
        errorMessage={errors.title?.message}
        id={fieldIds.FileTitle}
        label={DOCUMENTS.TITLE_LABEL}
        optionalLabel={TEXTS.COURSES.OPTIONAL}
        placeholder={DOCUMENTS.TITLE_PLACEHOLDER}
        type={inputTypes.title}
        {...register(fields.Title)}
      />
      <FormErrorMessage message={errors[fields.Root]?.message} />
      <Button
        className={uploadCourseDocumentFormStyles.submit}
        disabled={isPending}
        type="submit"
      >
        {isPending ? DOCUMENTS.UPLOADING : DOCUMENTS.UPLOAD}
      </Button>
    </form>
  );
};
