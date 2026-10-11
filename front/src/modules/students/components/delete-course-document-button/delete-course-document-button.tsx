"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { deleteCourseDocumentAction } from "../../actions/course-documents-actions";
import { deleteCourseDocumentButtonStyles } from "./style";
import type { DeleteCourseDocumentButtonProps } from "./types";

export const DeleteCourseDocumentButton = ({
  document,
  title,
}: DeleteCourseDocumentButtonProps) => {
  const { isPending, run: deleteDocument } =
    useServerAction(deleteCourseDocumentAction);

  const handleClick = async () => {
    const result = await deleteDocument(document);

    if (!result.ok) {
      toast.error(ERRORS.COURSE_DOCUMENTS.DELETE_FAILED);
      return;
    }

    toast.success(TEXTS.COURSES.DOCUMENTS.DELETED);
  };

  return (
    <Button
      aria-label={TEXTS.COURSES.DOCUMENTS.DELETE_LABEL(title)}
      disabled={isPending}
      onClick={() => void handleClick()}
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
