"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerActionToast } from "@/modules/common/hooks";
import { deleteCourseDocumentAction } from "../../actions/course-documents-actions";
import { deleteCourseDocumentButtonStyles } from "./style";
import type { DeleteCourseDocumentButtonProps } from "./types";

export const DeleteCourseDocumentButton = ({
  document,
  title,
}: DeleteCourseDocumentButtonProps) => {
  const { isPending, run: deleteDocument } = useServerActionToast(
    deleteCourseDocumentAction,
    {
      getErrorMessage: () => ERRORS.COURSE_DOCUMENTS.DELETE_FAILED,
      successMessage: TEXTS.COURSES.DOCUMENTS.DELETED,
    },
  );

  return (
    <Button
      aria-label={TEXTS.COURSES.DOCUMENTS.DELETE_LABEL(title)}
      disabled={isPending}
      onClick={() => void deleteDocument(document)}
      size="sm"
      variant="ghost"
    >
      <Trash2 aria-hidden className={deleteCourseDocumentButtonStyles.icon} />
      {isPending
        ? TEXTS.COURSES.DOCUMENTS.DELETING
        : TEXTS.COURSES.DOCUMENTS.DELETE}
    </Button>
  );
};
