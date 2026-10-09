"use client";

import { toast } from "sonner";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useOpenCourseDocument } from "../../hooks";
import { courseDocumentOpenButtonStyles } from "./style";
import type { CourseDocumentOpenButtonProps } from "./types";

export const CourseDocumentOpenButton = ({
  document,
  title,
}: CourseDocumentOpenButtonProps) => {
  const { isPending, open } = useOpenCourseDocument(document);

  const handleClick = async () => {
    try {
      await open();
    } catch {
      toast.error(ERRORS.COURSE_DOCUMENTS.OPEN_FAILED);
    }
  };

  return (
    <button
      aria-label={TEXTS.COURSES.DOCUMENTS.OPEN_LABEL(title)}
      className={courseDocumentOpenButtonStyles.root}
      disabled={isPending}
      onClick={() => void handleClick()}
      type="button"
    >
      {title}
    </button>
  );
};
