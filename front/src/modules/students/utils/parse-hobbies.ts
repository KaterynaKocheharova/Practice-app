import { STUDENTS_CONFIG } from "../students.config";

/** Splits the comma-separated hobbies input into trimmed, unique, non-empty items. */
export const parseHobbies = (value: string): string[] => [
  ...new Set(
    value
      .split(STUDENTS_CONFIG.hobbiesSeparator)
      .map((hobby) => hobby.trim())
      .filter(Boolean),
  ),
];
