import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../students.config";
import { getCourseDocumentKind } from "../utils";

const { documents } = STUDENTS_CONFIG;

const documentTitle = z
  .string()
  .trim()
  .max(documents.titleMaxLength, ERRORS.VALIDATION.DOCUMENT_TITLE_MAX_LENGTH);

/** Mirrors the backend: an accepted type, within that type's size limit. */
const documentFile = z
  .custom<FileList | undefined>()
  .transform((files) => files?.item(0) ?? undefined)
  .pipe(z.instanceof(File, { error: ERRORS.VALIDATION.DOCUMENT_FILE_REQUIRED }))
  .superRefine((file, context) => {
    const kind = getCourseDocumentKind(file);

    if (!kind) {
      context.addIssue({
        code: "custom",
        message: ERRORS.VALIDATION.DOCUMENT_FILE_TYPE,
      });
      return;
    }

    if (file.size > documents.maxSizeBytes[kind]) {
      context.addIssue({
        code: "custom",
        message: ERRORS.COURSE_DOCUMENTS.FILE_TOO_LARGE,
      });
    }
  });

export const courseFileDocumentFormSchema = z.object({
  file: documentFile,
  /** Optional: the backend falls back to the file name. */
  title: documentTitle,
});

export const courseLinkDocumentFormSchema = z.object({
  title: documentTitle.min(1, ERRORS.VALIDATION.DOCUMENT_TITLE_REQUIRED),
  url: z
    .string()
    .trim()
    .max(documents.urlMaxLength, ERRORS.VALIDATION.DOCUMENT_URL_MAX_LENGTH)
    .pipe(
      z.url({
        error: ERRORS.VALIDATION.DOCUMENT_URL_INVALID,
        protocol: documents.urlProtocol,
      }),
    ),
});

export type CourseFileDocumentFormInput = z.input<
  typeof courseFileDocumentFormSchema
>;
export type CourseFileDocumentFormValues = z.output<
  typeof courseFileDocumentFormSchema
>;
export type CourseLinkDocumentFormValues = z.output<
  typeof courseLinkDocumentFormSchema
>;

export const COURSE_FILE_DOCUMENT_FORM_DEFAULT_VALUES: CourseFileDocumentFormInput =
  {
    file: undefined,
    title: "",
  };

export const COURSE_LINK_DOCUMENT_FORM_DEFAULT_VALUES: CourseLinkDocumentFormValues =
  {
    title: "",
    url: "",
  };
