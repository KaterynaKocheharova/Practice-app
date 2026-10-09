import { CourseDocumentType } from "../../students.enums";
import { CourseDocumentDownloadButton } from "../course-document-download-button/course-document-download-button";
import { CourseDocumentIcon } from "../course-document-icon/course-document-icon";
import { CourseDocumentLink } from "../course-document-link/course-document-link";
import { CourseDocumentMeta } from "../course-document-meta/course-document-meta";
import { DeleteCourseDocumentButton } from "../delete-course-document-button/delete-course-document-button";
import { courseDocumentItemStyles } from "./style";
import type { CourseDocumentItemProps } from "./types";

export const CourseDocumentItem = ({
  course,
  document,
}: CourseDocumentItemProps) => {
  const documentRequest = { ...course, documentId: document.id };

  return (
    <li className={courseDocumentItemStyles.root}>
      <CourseDocumentIcon file={document.file} />
      <div className={courseDocumentItemStyles.content}>
        {document.type === CourseDocumentType.Link ? (
          <CourseDocumentLink title={document.title} url={document.url} />
        ) : (
          <CourseDocumentDownloadButton
            document={documentRequest}
            title={document.title}
          />
        )}
        <CourseDocumentMeta addedBy={document.addedBy} file={document.file} />
      </div>
      {document.canDelete && (
        <DeleteCourseDocumentButton
          document={documentRequest}
          title={document.title}
        />
      )}
    </li>
  );
};
