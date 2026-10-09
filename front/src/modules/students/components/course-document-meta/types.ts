import type { CourseDocument } from "../../types";

export type CourseDocumentMetaProps = Pick<CourseDocument, "addedBy" | "file">;
