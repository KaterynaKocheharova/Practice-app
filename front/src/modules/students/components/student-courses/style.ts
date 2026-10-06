import { StudentsHeadingLevel } from "../../students.enums";

export const studentCoursesStyles = {
  header: "flex flex-wrap items-center justify-between gap-4",
  root: "flex flex-col gap-6",
  title: {
    [StudentsHeadingLevel.H1]: "text-2xl font-semibold text-foreground",
    [StudentsHeadingLevel.H2]: "text-xl font-semibold text-foreground",
  } satisfies Record<StudentsHeadingLevel, string>,
} as const;
