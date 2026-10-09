import { TEXTS } from "@/modules/common/constants";
import { courseDocumentLinkStyles } from "./style";
import type { CourseDocumentLinkProps } from "./types";

/** External link added by a user; opened in a new tab without an opener. */
export const CourseDocumentLink = ({ title, url }: CourseDocumentLinkProps) => (
  <a
    aria-label={TEXTS.COURSES.DOCUMENTS.OPEN_LABEL(title)}
    className={courseDocumentLinkStyles.root}
    href={url}
    rel="noopener noreferrer"
    target="_blank"
  >
    {title}
  </a>
);
