import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { MediaAssetsService } from '../../media-assets';
import { CourseDocumentsRepository } from '../repositories';
import type { CourseDocumentActionParams } from '../types';
import { CourseDocumentsQueueService } from './course-documents-queue.service';

/**
 * Deletion in two phases: the request hides the document right away, then a
 * background job removes the stored file and the rows for good.
 */
@Injectable()
export class CourseDocumentDeletionService {
  constructor(
    private readonly courseDocumentsRepository: CourseDocumentsRepository,
    private readonly courseDocumentsQueueService: CourseDocumentsQueueService,
    private readonly mediaAssetsService: MediaAssetsService,
  ) {}

  async deleteCourseDocument(
    params: CourseDocumentActionParams,
  ): Promise<void> {
    const deletedDocument =
      await this.courseDocumentsRepository.softDeleteCourseDocument(params);

    if (!deletedDocument) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND,
      });
    }

    await this.courseDocumentsQueueService.enqueuePurgeCourseDocument(
      deletedDocument.id,
    );
  }

  /**
   * Job step: the file goes first so a failed attempt can be retried; the
   * document row goes last (for files it is already gone via cascade).
   */
  async purgeCourseDocument(documentId: string): Promise<void> {
    const document =
      await this.courseDocumentsRepository.getDeletedCourseDocument(documentId);

    if (!document) {
      return;
    }

    if (document.mediaAssetId) {
      await this.mediaAssetsService.deleteMediaAsset(document.mediaAssetId);
    }

    await this.courseDocumentsRepository.deleteCourseDocument(document.id);
  }
}
