import { Injectable } from '@nestjs/common';

import {
  MediaAssetUploadService,
  type MediaAssetUploadRequest,
  type MediaAssetUploadResponse,
} from '../../media-assets';
import { studentsConfig } from '../config';
import type { CreateCourseFileDocumentDto } from '../dto';
import { CourseDocumentsRepository } from '../repositories';
import type {
  CourseDocumentActorParams,
  CreatedCourseDocumentResponse,
} from '../types';
import { CourseDocumentsService } from './course-documents.service';

const { COURSE_DOCUMENTS } = studentsConfig;

/**
 * File documents in two calls: an upload URL first, then (after the client
 * uploaded straight to storage) the document that claims the uploaded file.
 */
@Injectable()
export class CourseDocumentUploadService {
  constructor(
    private readonly courseDocumentsRepository: CourseDocumentsRepository,
    private readonly courseDocumentsService: CourseDocumentsService,
    private readonly mediaAssetUploadService: MediaAssetUploadService,
  ) {}

  async requestFileUpload(
    { courseId, userId }: CourseDocumentActorParams,
    uploadRequest: MediaAssetUploadRequest,
  ): Promise<MediaAssetUploadResponse> {
    await this.courseDocumentsService.ensureCourseHasCapacity(courseId);

    return this.mediaAssetUploadService.requestUpload({
      ...uploadRequest,
      uploaderId: userId,
    });
  }

  async createFileDocument(
    { courseId, userId }: CourseDocumentActorParams,
    { mediaAssetId, title }: CreateCourseFileDocumentDto,
  ): Promise<CreatedCourseDocumentResponse> {
    const asset = await this.mediaAssetUploadService.getVerifiedPendingAsset({
      mediaAssetId,
      uploaderId: userId,
    });
    const result =
      await this.courseDocumentsRepository.createFileDocumentFromPendingAsset(
        {
          courseId,
          title: title ?? asset.originalName,
          mediaAssetId: asset.id,
          addedByUserId: userId,
        },
        COURSE_DOCUMENTS.MAX_PER_COURSE,
      );

    return this.courseDocumentsService.toCreatedDocument(result);
  }
}
