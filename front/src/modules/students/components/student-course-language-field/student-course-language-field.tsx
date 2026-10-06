import {
  Button,
  FormErrorMessage,
  SelectField,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { toLanguageOptions } from "../../utils";
import { studentCourseLanguageFieldStyles } from "./style";
import type { StudentCourseLanguageFieldProps } from "./types";

const { fieldIds } = STUDENTS_CONFIG.forms.createStudentCourse;

/** Offers only the languages the backend reports as still free. */
export const StudentCourseLanguageField = ({
  availableLanguages,
  errorMessage,
  isError,
  isPending,
  onRetry,
  registration,
}: StudentCourseLanguageFieldProps) => {
  if (isError) {
    return (
      <div className={studentCourseLanguageFieldStyles.status}>
        <FormErrorMessage message={ERRORS.COURSES.LOAD_LANGUAGES_FAILED} />
        <Button onClick={onRetry} variant="secondary">
          {TEXTS.COURSES.RETRY}
        </Button>
      </div>
    );
  }

  if (availableLanguages?.length === 0) {
    return (
      <p className={studentCourseLanguageFieldStyles.message} role="status">
        {TEXTS.COURSES.ALL_LANGUAGES_TAKEN}
      </p>
    );
  }

  return (
    <SelectField
      disabled={isPending}
      errorId={fieldIds.LanguageError}
      errorMessage={errorMessage}
      id={fieldIds.Language}
      label={TEXTS.COURSES.LANGUAGE}
      options={toLanguageOptions(availableLanguages ?? [])}
      placeholder={
        isPending
          ? TEXTS.COURSES.LOADING_LANGUAGES
          : TEXTS.COURSES.LANGUAGE_PLACEHOLDER
      }
      required
      {...registration}
    />
  );
};
