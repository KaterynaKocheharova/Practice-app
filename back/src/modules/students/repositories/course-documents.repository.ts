import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
  type SQL,
} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { MediaAssetStatus } from '../../media-assets';
import { mediaAssets } from '../../media-assets/schemas/schema';
import { users } from '../../users/schemas/schema';
import type { DatabaseTransaction } from '../../users/types';
import {
  courseDocumentFileSelectFields,
  courseDocumentIdSelectFields,
  courseDocumentListSelectFields,
  deletedCourseDocumentSelectFields,
  studentLanguageCourseIdSelectFields,
} from '../constants/repository';
import { CourseDocumentCreateOutcome, CourseDocumentType } from '../enums';
import { courseDocuments, studentLanguageCourses } from '../schemas/schema';
import type {
  CourseAccessParams,
  CourseDocumentActionParams,
  CourseDocumentCreateBlocker,
  CourseDocumentIdData,
  CourseDocumentFileData,
  CourseDocumentListRowData,
  CreateCourseFileDocumentData,
  CreateCourseFileDocumentResult,
  CreateCourseLinkDocumentData,
  CreateCourseLinkDocumentResult,
  DeletedCourseDocumentData,
} from '../types';

@Injectable()
export class CourseDocumentsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async countAccessibleCourseDocuments(
    access: CourseAccessParams,
  ): Promise<number | undefined> {
    const [course] = await this.database
      .select({ total: count(courseDocuments.id) })
      .from(studentLanguageCourses)
      .leftJoin(
        courseDocuments,
        and(
          eq(courseDocuments.courseId, studentLanguageCourses.id),
          isNull(courseDocuments.deletedAt),
        ),
      )
      .where(this.accessibleCourseFilter(access))
      .groupBy(studentLanguageCourses.id);

    return course?.total;
  }

  /**
   * Claims the uploader's pending asset and attaches it in one transaction,
   * within the per-course limit. The conditional update makes a second claim
   * of the same asset fail instead of creating a duplicate document.
   */
  @HandleDatabaseError()
  async createFileDocumentFromPendingAsset(
    access: CourseAccessParams,
    { mediaAssetId, title }: CreateCourseFileDocumentData,
    maxDocumentsPerCourse: number,
  ): Promise<CreateCourseFileDocumentResult> {
    return this.database.transaction(async (transaction) => {
      const blocker = await this.getCreateBlocker(
        transaction,
        access,
        maxDocumentsPerCourse,
      );

      if (blocker) {
        return { outcome: blocker };
      }

      const [claimedAsset] = await transaction
        .update(mediaAssets)
        .set({ status: MediaAssetStatus.Uploaded })
        .where(
          and(
            eq(mediaAssets.id, mediaAssetId),
            eq(mediaAssets.uploadedByUserId, access.userId),
            eq(mediaAssets.status, MediaAssetStatus.Pending),
          ),
        )
        .returning({ id: mediaAssets.id });

      if (!claimedAsset) {
        return { outcome: CourseDocumentCreateOutcome.AssetUnavailable };
      }

      const [createdDocument] = await transaction
        .insert(courseDocuments)
        .values({
          courseId: access.courseId,
          title,
          type: CourseDocumentType.File,
          mediaAssetId,
          addedByUserId: access.userId,
        })
        .returning(courseDocumentIdSelectFields);

      return {
        outcome: CourseDocumentCreateOutcome.Created,
        document: createdDocument,
      };
    });
  }

  /** Inserts the link within the per-course limit. */
  @HandleDatabaseError()
  async createLinkDocument(
    access: CourseAccessParams,
    { title, url }: CreateCourseLinkDocumentData,
    maxDocumentsPerCourse: number,
  ): Promise<CreateCourseLinkDocumentResult> {
    return this.database.transaction(async (transaction) => {
      const blocker = await this.getCreateBlocker(
        transaction,
        access,
        maxDocumentsPerCourse,
      );

      if (blocker) {
        return { outcome: blocker };
      }

      const [createdDocument] = await transaction
        .insert(courseDocuments)
        .values({
          courseId: access.courseId,
          title,
          url,
          type: CourseDocumentType.Link,
          addedByUserId: access.userId,
        })
        .returning(courseDocumentIdSelectFields);

      return {
        outcome: CourseDocumentCreateOutcome.Created,
        document: createdDocument,
      };
    });
  }

  /** Active documents of a course, newest first. */
  @HandleDatabaseError()
  async getCourseDocuments(
    courseId: string,
  ): Promise<CourseDocumentListRowData[]> {
    return this.database
      .select(courseDocumentListSelectFields)
      .from(courseDocuments)
      .leftJoin(users, eq(users.id, courseDocuments.addedByUserId))
      .leftJoin(mediaAssets, eq(mediaAssets.id, courseDocuments.mediaAssetId))
      .where(this.activeCourseDocumentFilter(courseId))
      .orderBy(desc(courseDocuments.createdAt));
  }

  /** The stored file behind an active `file` document; links have none. */
  @HandleDatabaseError()
  async getCourseDocumentFile({
    documentId,
    ...access
  }: CourseDocumentActionParams): Promise<CourseDocumentFileData | undefined> {
    const [file] = await this.database
      .select(courseDocumentFileSelectFields)
      .from(courseDocuments)
      .innerJoin(mediaAssets, eq(mediaAssets.id, courseDocuments.mediaAssetId))
      .innerJoin(
        studentLanguageCourses,
        eq(studentLanguageCourses.id, courseDocuments.courseId),
      )
      .where(
        and(
          eq(courseDocuments.id, documentId),
          this.activeCourseDocumentFilter(access.courseId),
          this.accessibleCourseFilter(access),
        ),
      )
      .limit(1);

    return file;
  }

  /** Marks the document deleted, only if the given user added it. */
  @HandleDatabaseError()
  async softDeleteCourseDocument({
    documentId,
    ...access
  }: CourseDocumentActionParams): Promise<CourseDocumentIdData | undefined> {
    const [document] = await this.database
      .update(courseDocuments)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(courseDocuments.id, documentId),
          eq(courseDocuments.addedByUserId, access.userId),
          this.activeCourseDocumentFilter(access.courseId),
          inArray(courseDocuments.courseId, this.accessibleCourseIds(access)),
        ),
      )
      .returning(courseDocumentIdSelectFields);

    return document;
  }

  @HandleDatabaseError()
  async getDeletedCourseDocument(
    documentId: string,
  ): Promise<DeletedCourseDocumentData | undefined> {
    const [document] = await this.database
      .select(deletedCourseDocumentSelectFields)
      .from(courseDocuments)
      .where(
        and(
          eq(courseDocuments.id, documentId),
          isNotNull(courseDocuments.deletedAt),
        ),
      )
      .limit(1);

    return document;
  }

  @HandleDatabaseError()
  async deleteCourseDocument(documentId: string): Promise<void> {
    await this.database
      .delete(courseDocuments)
      .where(eq(courseDocuments.id, documentId));
  }

  private async getCreateBlocker(
    transaction: DatabaseTransaction,
    access: CourseAccessParams,
    maxDocumentsPerCourse: number,
  ): Promise<CourseDocumentCreateBlocker | undefined> {
    const [course] = await transaction
      .select(studentLanguageCourseIdSelectFields)
      .from(studentLanguageCourses)
      .where(this.accessibleCourseFilter(access))
      .for('update');

    if (!course) {
      return CourseDocumentCreateOutcome.CourseNotFound;
    }

    const [result] = await transaction
      .select({ total: count() })
      .from(courseDocuments)
      .where(this.activeCourseDocumentFilter(access.courseId));

    return result.total < maxDocumentsPerCourse
      ? undefined
      : CourseDocumentCreateOutcome.LimitReached;
  }

  private accessibleCourseIds(access: CourseAccessParams) {
    return this.database
      .select(studentLanguageCourseIdSelectFields)
      .from(studentLanguageCourses)
      .where(this.accessibleCourseFilter(access));
  }

  private accessibleCourseFilter({
    courseId,
    studentId,
    userId,
  }: CourseAccessParams): SQL | undefined {
    return and(
      eq(studentLanguageCourses.id, courseId),
      eq(studentLanguageCourses.studentId, studentId),
      or(
        eq(studentLanguageCourses.studentId, userId),
        eq(studentLanguageCourses.teacherId, userId),
      ),
    );
  }

  private activeCourseDocumentFilter(courseId: string): SQL | undefined {
    return and(
      eq(courseDocuments.courseId, courseId),
      isNull(courseDocuments.deletedAt),
    );
  }
}
