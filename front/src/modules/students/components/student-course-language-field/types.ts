import type { UseFormRegisterReturn } from "react-hook-form";
import type { Language } from "../../students.enums";

export interface StudentCourseLanguageFieldProps {
  availableLanguages: Language[] | undefined;
  errorMessage?: string;
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
  registration: UseFormRegisterReturn;
}
