import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, isNotNull, isNull, type SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { MediaAssetStatus } from '../../media-assets';
import { mediaAssets } from '../../media-assets/schemas/schema';
import { users } from '../../users/schemas/schema';
import {
  courseDocumentAuthorSelectFields,
  courseDocumentFileSelectFields,
  courseDocumentIdSelectFields,
  courseDocumentListSelectFields,
  deletedCourseDocumentSelectFields,
} from '../constants/repository';
import { CourseDocumentType } from '../enums';
import { courseDocuments } from '../schemas/schema';
import type {
  CourseDocumentActionParams,
  CourseDocumentIdData,
  CourseDocumentAuthorData,
  CourseDocumentFileData,
  CourseDocumentListRowData,
  CourseDocumentLookupParams,
  CreateCourseFileDocumentData,
  CreateCourseLinkDocumentData,
  CreatedCourseDocumentResponse,
  DeletedCourseDocumentData,
} from '../types';

@Injectable()
export class CourseDocumentsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  /** Documents not marked as deleted. */
  @HandleDatabaseError()
  async countActiveCourseDocuments(courseId: string): Promise<number> {
    const [result] = await this.database
      .select({ total: count() })
      .from(courseDocuments)
      .where(this.activeCourseDocumentFilter(courseId));

    return result.total;
  }

  /**
   * Claims the uploader's pending asset and attaches it in one transaction.
   * The conditional update makes a second claim of the same asset return
   * `undefined` instead of creating a duplicate document.
   */
  @HandleDatabaseError()
  async createFileDocumentFromPendingAsset({
    mediaAssetId,
    addedByUserId,
    ...document
  }: CreateCourseFileDocumentData): Promise<
    CreatedCourseDocumentResponse | undefined
  > {
    return this.database.transaction(async (transaction) => {
      const [claimedAsset] = await transaction
        .update(mediaAssets)
        .set({ status: MediaAssetStatus.Uploaded })
        .where(
          and(
            eq(mediaAssets.id, mediaAssetId),
            eq(mediaAssets.uploadedByUserId, addedByUserId),
            eq(mediaAssets.status, MediaAssetStatus.Pending),
          ),
        )
        .returning({ id: mediaAssets.id });

      if (!claimedAsset) {
        return undefined;
      }

      const [createdDocument] = await transaction
        .insert(courseDocuments)
        .values({
          ...document,
          type: CourseDocumentType.File,
          mediaAssetId,
          addedByUserId,
        })
        .returning(courseDocumentIdSelectFields);

      return createdDocument;
    });
  }

  @HandleDatabaseError()
  async createLinkDocument(
    document: CreateCourseLinkDocumentData,
  ): Promise<CreatedCourseDocumentResponse> {
    const [createdDocument] = await this.database
      .insert(courseDocuments)
      .values({ ...document, type: CourseDocumentType.Link })
      .returning(courseDocumentIdSelectFields);

    return createdDocument;
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

  @HandleDatabaseError()
  async getCourseDocumentAuthor({
    courseId,
    documentId,
  }: CourseDocumentLookupParams): Promise<
    CourseDocumentAuthorData | undefined
  > {
    const [document] = await this.database
      .select(courseDocumentAuthorSelectFields)
      .from(courseDocuments)
      .where(
        and(
          eq(courseDocuments.id, documentId),
          this.activeCourseDocumentFilter(courseId),
        ),
      )
      .limit(1);

    return document;
  }

  /** The stored file behind an active `file` document; links have none. */
  @HandleDatabaseError()
  async getCourseDocumentFile({
    courseId,
    documentId,
  }: CourseDocumentLookupParams): Promise<CourseDocumentFileData | undefined> {
    const [file] = await this.database
      .select(courseDocumentFileSelectFields)
      .from(courseDocuments)
      .innerJoin(mediaAssets, eq(mediaAssets.id, courseDocuments.mediaAssetId))
      .where(
        and(
          eq(courseDocuments.id, documentId),
          this.activeCourseDocumentFilter(courseId),
        ),
      )
      .limit(1);

    return file;
  }

  /** Marks the document deleted, only if the given user added it. */
  @HandleDatabaseError()
  async softDeleteCourseDocument({
    courseId,
    documentId,
    userId,
  }: CourseDocumentActionParams): Promise<CourseDocumentIdData | undefined> {
    const [document] = await this.database
      .update(courseDocuments)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(courseDocuments.id, documentId),
          eq(courseDocuments.addedByUserId, userId),
          this.activeCourseDocumentFilter(courseId),
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

  private activeCourseDocumentFilter(courseId: string): SQL | undefined {
    return and(
      eq(courseDocuments.courseId, courseId),
      isNull(courseDocuments.deletedAt),
    );
  }
}
