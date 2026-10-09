"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useDeleteCourseDocument } from "../../hooks";
import { deleteCourseDocumentButtonStyles } from "./style";
import type { DeleteCourseDocumentButtonProps } from "./types";

export const DeleteCourseDocumentButton = ({
  document,
  title,
}: DeleteCourseDocumentButtonProps) => {
  const { mutateAsync: deleteDocument, isPending } =
    useDeleteCourseDocument(document);

  const handleClick = async () => {
    try {
      await deleteDocument();
      toast.success(TEXTS.COURSES.DOCUMENTS.DELETED);
    } catch {
      toast.error(ERRORS.COURSE_DOCUMENTS.DELETE_FAILED);
    }
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
