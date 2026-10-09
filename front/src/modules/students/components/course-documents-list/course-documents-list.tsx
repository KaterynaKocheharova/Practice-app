import { TEXTS } from "@/modules/common/constants";
import { CourseDocumentItem } from "../course-document-item/course-document-item";
import { courseDocumentsListStyles } from "./style";
import type { CourseDocumentsListProps } from "./types";

export const CourseDocumentsList = ({
  course,
  documents,
}: CourseDocumentsListProps) => {
  if (documents.length === 0) {
    return (
      <p className={courseDocumentsListStyles.empty}>
        {TEXTS.COURSES.DOCUMENTS.EMPTY}
      </p>
    );
  }

  return (
    <ul
      aria-label={TEXTS.COURSES.DOCUMENTS.LIST_LABEL}
      className={courseDocumentsListStyles.root}
    >
      {documents.map((document) => (
        <CourseDocumentItem
          course={course}
          document={document}
          key={document.id}
        />
      ))}
    </ul>
  );
};
