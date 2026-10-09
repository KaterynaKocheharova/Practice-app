import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { formatFileSize } from "../../utils";
import { courseDocumentMetaStyles } from "./style";
import type { CourseDocumentMetaProps } from "./types";

const { roleLabels } = STUDENTS_CONFIG.documents;

export const CourseDocumentMeta = ({ addedBy, file }: CourseDocumentMetaProps) => (
  <p className={courseDocumentMetaStyles.root}>
    {file && <span>{formatFileSize(file.sizeBytes)}</span>}
    {addedBy && (
      <span>
        {TEXTS.COURSES.DOCUMENTS.ADDED_BY(
          addedBy.name,
          roleLabels[addedBy.role],
        )}
      </span>
    )}
  </p>
);
