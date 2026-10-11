import type { UseFormRegisterReturn } from "react-hook-form";
import type { Language } from "../../students.enums";

export interface StudentCourseLanguageFieldProps {
  /** `null` when the server could not load them. */
  availableLanguages: Language[] | null;
  errorMessage?: string;
  registration: UseFormRegisterReturn;
}
