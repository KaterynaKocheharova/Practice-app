import {
  FormErrorMessage,
  RefreshButton,
  SelectField,
} from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { toLanguageOptions } from "../../utils";
import { studentCourseLanguageFieldStyles } from "./style";
import type { StudentCourseLanguageFieldProps } from "./types";

const { fieldIds } = STUDENTS_CONFIG.forms.studentCourse;

/** Offers only the languages the backend reports as still free. */
export const StudentCourseLanguageField = ({
  availableLanguages,
  errorMessage,
  registration,
}: StudentCourseLanguageFieldProps) => {
  if (!availableLanguages) {
    return (
      <div className={studentCourseLanguageFieldStyles.status}>
        <FormErrorMessage message={ERRORS.COURSES.LOAD_LANGUAGES_FAILED} />
        <RefreshButton>{TEXTS.COURSES.RETRY}</RefreshButton>
      </div>
    );
  }

  if (availableLanguages.length === 0) {
    return (
      <p className={studentCourseLanguageFieldStyles.message} role="status">
        {TEXTS.COURSES.ALL_LANGUAGES_TAKEN}
      </p>
    );
  }

  return (
    <SelectField
      errorId={fieldIds.LanguageError}
      errorMessage={errorMessage}
      id={fieldIds.Language}
      label={TEXTS.COURSES.LANGUAGE}
      options={toLanguageOptions(availableLanguages)}
      placeholder={TEXTS.COURSES.LANGUAGE_PLACEHOLDER}
      required
      {...registration}
    />
  );
};
