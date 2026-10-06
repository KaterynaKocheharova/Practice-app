import type { SelectOption } from "@/modules/common/components/select-field/types";
import { STUDENTS_CONFIG } from "../students.config";
import type { Language } from "../students.enums";

export const toLanguageOptions = (languages: Language[]): SelectOption[] =>
  languages.map((language) => ({
    disabled: false,
    label: STUDENTS_CONFIG.courseLabels.languages[language],
    value: language,
  }));
