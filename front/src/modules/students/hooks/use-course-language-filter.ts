"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Language } from "../students.enums";
import { StudentsQueryParam } from "../students.enums";

/** Keeps the selected language in the URL so the filter survives reloads. */
export const useCourseLanguageFilter = () => {
  const pathname = usePathname();
  const router = useRouter();

  const selectLanguage = (language: Language | null) => {
    if (!language) {
      router.replace(pathname, { scroll: false });
      return;
    }

    const searchParams = new URLSearchParams({
      [StudentsQueryParam.Language]: language,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return { selectLanguage };
};
