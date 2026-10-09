"use client";

import { toast } from "sonner";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useDownloadCourseDocument } from "../../hooks";
import { courseDocumentDownloadButtonStyles } from "./style";
import type { CourseDocumentDownloadButtonProps } from "./types";

export const CourseDocumentDownloadButton = ({
  document,
  title,
}: CourseDocumentDownloadButtonProps) => {
  const { mutateAsync: download, isPending } =
    useDownloadCourseDocument(document);

  const handleClick = async () => {
    try {
      await download();
    } catch {
      toast.error(ERRORS.COURSE_DOCUMENTS.DOWNLOAD_FAILED);
    }
  };

  return (
    <button
      aria-label={TEXTS.COURSES.DOCUMENTS.DOWNLOAD_LABEL(title)}
      className={courseDocumentDownloadButtonStyles.root}
      disabled={isPending}
      onClick={() => void handleClick()}
      type="button"
    >
      {title}
    </button>
  );
};
