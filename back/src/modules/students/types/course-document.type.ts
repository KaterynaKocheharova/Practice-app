import type { MediaAssetKind } from '../../media-assets';
import type { UserRole } from '../../users/enums';
import type { CourseDocumentCreateOutcome, CourseDocumentType } from '../enums';
import type { courseDocuments } from '../schemas/schema';

type CourseDocumentRowData = typeof courseDocuments.$inferSelect;

export type CourseDocumentIdData = Pick<CourseDocumentRowData, 'id'>;

export type CreatedCourseDocumentResponse = CourseDocumentIdData;

/** A user acting on one course's documents (access already checked). */
export type CourseDocumentActorParams = {
  courseId: string;
  userId: string;
};

export type CourseDocumentLookupParams = {
  courseId: string;
  documentId: string;
};

export type CourseDocumentActionParams = CourseDocumentActorParams &
  CourseDocumentLookupParams;

export type CreateCourseFileDocumentData = Pick<
  CourseDocumentRowData,
  'courseId' | 'title'
> & {
  mediaAssetId: string;
  addedByUserId: string;
};

export type CreateCourseLinkDocumentData = Pick<
  CourseDocumentRowData,
  'courseId' | 'title'
> & {
  url: string;
  addedByUserId: string;
};

/** One flat row of the course documents list, as joined in SQL. */
export type CourseDocumentListRowData = Pick<
  CourseDocumentRowData,
  'id' | 'type' | 'title' | 'url' | 'addedByUserId'
> & {
  addedByName: string | null;
  addedByRole: UserRole | null;
  fileSizeBytes: number | null;
  fileKind: MediaAssetKind | null;
};

export type CourseDocumentAuthorData = Pick<
  CourseDocumentRowData,
  'addedByUserId'
>;

export type CourseDocumentFileData = {
  storageKey: string;
  originalName: string;
};

export type DeletedCourseDocumentData = Pick<
  CourseDocumentRowData,
  'id' | 'mediaAssetId'
>;

export type CourseDocumentFileResponse = {
  sizeBytes: number;
  kind: MediaAssetKind;
};

export type CourseDocumentAuthorResponse = {
  name: string;
  role: UserRole;
};

export type CourseDocumentResponse = {
  id: string;
  type: CourseDocumentType;
  title: string;
  /** Set for links only. */
  url: string | null;
  /** Set for files only. */
  file: CourseDocumentFileResponse | null;
  /** `null` once the adding user's account is gone. */
  addedBy: CourseDocumentAuthorResponse | null;
  /** Whether the viewer may delete it: only the user who added it can. */
  canDelete: boolean;
};

export type WithCourseDocuments<TCourse> = TCourse & {
  documents: CourseDocumentResponse[];
};

export type CourseDocumentDownloadUrlResponse = {
  url: string;
};

export type PurgeCourseDocumentJobData = {
  documentId: string;
};

type CourseDocumentCreatedResult = {
  outcome: CourseDocumentCreateOutcome.Created;
  document: CreatedCourseDocumentResponse;
};

export type CreateCourseLinkDocumentResult =
  | CourseDocumentCreatedResult
  | { outcome: CourseDocumentCreateOutcome.LimitReached };

export type CreateCourseFileDocumentResult =
  | CreateCourseLinkDocumentResult
  | { outcome: CourseDocumentCreateOutcome.AssetUnavailable };
