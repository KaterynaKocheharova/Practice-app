"use client";

import { SelectField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { toSelectOptions } from "@/modules/common/utils";
import { useCourseLanguageFilter } from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { parseCourseLanguage } from "../../utils";
import { studentCourseLanguageFilterStyles } from "./style";
import type { StudentCourseLanguageFilterProps } from "./types";

const LANGUAGE_OPTIONS = toSelectOptions(
  STUDENTS_CONFIG.courseLabels.languages,
);

export const StudentCourseLanguageFilter = ({
  language,
}: StudentCourseLanguageFilterProps) => {
  const { selectLanguage } = useCourseLanguageFilter();

  return (
    <div className={studentCourseLanguageFilterStyles.root}>
      <SelectField
        id={STUDENTS_CONFIG.filters.courseLanguageId}
        label={TEXTS.COURSES.FILTER_LANGUAGE}
        onChange={(event) =>
          selectLanguage(parseCourseLanguage(event.target.value))
        }
        options={LANGUAGE_OPTIONS}
        placeholder={TEXTS.COURSES.ALL_LANGUAGES}
        value={language ?? ""}
      />
    </div>
  );
};
