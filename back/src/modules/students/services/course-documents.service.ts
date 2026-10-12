import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { MediaAssetsService } from '../../media-assets';
import { studentsConfig } from '../config';
import type { CreateCourseLinkDocumentDto } from '../dto';
import { CourseDocumentCreateOutcome } from '../enums';
import { CourseDocumentsRepository } from '../repositories';
import type {
  CourseDocumentLookupParams,
  CourseDocumentActorParams,
  CourseDocumentDownloadUrlResponse,
  CourseDocumentListRowData,
  CourseDocumentResponse,
  CreateCourseFileDocumentResult,
  CreatedCourseDocumentResponse,
} from '../types';

const { COURSE_DOCUMENTS } = studentsConfig;

/** Course documents for users whose course access was already checked. */
@Injectable()
export class CourseDocumentsService {
  constructor(
    private readonly courseDocumentsRepository: CourseDocumentsRepository,
    private readonly mediaAssetsService: MediaAssetsService,
  ) {}

  async getCourseDocuments({
    courseId,
    userId,
  }: CourseDocumentActorParams): Promise<CourseDocumentResponse[]> {
    const documents =
      await this.courseDocumentsRepository.getCourseDocuments(courseId);

    return documents.map((document) =>
      this.toCourseDocumentResponse(document, userId),
    );
  }

  async createLinkDocument(
    { courseId, userId }: CourseDocumentActorParams,
    { url, title }: CreateCourseLinkDocumentDto,
  ): Promise<CreatedCourseDocumentResponse> {
    const result = await this.courseDocumentsRepository.createLinkDocument(
      { courseId, title, url, addedByUserId: userId },
      COURSE_DOCUMENTS.MAX_PER_COURSE,
    );

    return this.toCreatedDocument(result);
  }

  toCreatedDocument(
    result: CreateCourseFileDocumentResult,
  ): CreatedCourseDocumentResponse {
    switch (result.outcome) {
      case CourseDocumentCreateOutcome.Created:
        return result.document;
      case CourseDocumentCreateOutcome.LimitReached:
        throw this.createLimitReachedException();
      case CourseDocumentCreateOutcome.AssetUnavailable:
        throw new NotFoundException({
          errorCode: ERROR_CODE.MEDIA_ASSET_NOT_FOUND,
        });
    }
  }

  /** Short-lived download URL; any user with course access may download. */
  async createDownloadUrl({
    courseId,
    documentId,
  }: CourseDocumentLookupParams): Promise<CourseDocumentDownloadUrlResponse> {
    const file = await this.courseDocumentsRepository.getCourseDocumentFile({
      courseId,
      documentId,
    });

    if (!file) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND,
      });
    }

    return { url: await this.mediaAssetsService.createDownloadUrl(file) };
  }

  async ensureCourseHasCapacity(courseId: string): Promise<void> {
    const total =
      await this.courseDocumentsRepository.countActiveCourseDocuments(courseId);

    if (total >= COURSE_DOCUMENTS.MAX_PER_COURSE) {
      throw this.createLimitReachedException();
    }
  }

  private createLimitReachedException(): ConflictException {
    return new ConflictException({
      errorCode: ERROR_CODE.COURSE_DOCUMENTS_LIMIT_REACHED,
    });
  }

  private toCourseDocumentResponse(
    {
      id,
      type,
      title,
      url,
      addedByUserId,
      addedByName,
      addedByRole,
      fileSizeBytes,
      fileKind,
    }: CourseDocumentListRowData,
    viewerId: string,
  ): CourseDocumentResponse {
    const hasFile = fileSizeBytes !== null && fileKind !== null;
    const hasAuthor = addedByName !== null && addedByRole !== null;

    return {
      id,
      type,
      title,
      url,
      file: hasFile ? { sizeBytes: fileSizeBytes, kind: fileKind } : null,
      addedBy: hasAuthor ? { name: addedByName, role: addedByRole } : null,
      canDelete: addedByUserId === viewerId,
    };
  }
}
