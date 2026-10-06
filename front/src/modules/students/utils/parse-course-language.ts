import { Language } from "../students.enums";

const LANGUAGES = new Set<string>(Object.values(Language));

const isLanguage = (value: string): value is Language => LANGUAGES.has(value);

/** Reads the `language` search param; unknown values mean "all languages". */
export const parseCourseLanguage = (
  value: string | string[] | undefined,
): Language | null =>
  typeof value === "string" && isLanguage(value) ? value : null;
