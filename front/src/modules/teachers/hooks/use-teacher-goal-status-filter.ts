"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { TEACHERS_CONFIG } from "../teachers.config";
import { TeachersQueryParam, type TeacherGoalStatus } from "../teachers.enums";

export const useTeacherGoalStatusFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectStatus = (status: TeacherGoalStatus) => {
    const searchParams = new URLSearchParams(
      status === TEACHERS_CONFIG.filters.defaultStatus
        ? {}
        : { [TeachersQueryParam.Status]: status },
    );
    const query = searchParams.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  return { isPending, selectStatus };
};
