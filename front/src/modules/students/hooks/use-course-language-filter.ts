"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Language } from "../students.enums";
import { StudentsQueryParam } from "../students.enums";

/**
 * Keeps the selected language in the URL so the filter survives reloads. The
 * server re-renders the list; the old one stays visible until it arrives.
 */
export const useCourseLanguageFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectLanguage = (language: Language | null) => {
    const searchParams = new URLSearchParams(
      language ? { [StudentsQueryParam.Language]: language } : {},
    );
    const query = searchParams.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  return { isPending, selectLanguage };
};
