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
  CourseAccessParams,
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
    access: CourseAccessParams,
    uploadRequest: MediaAssetUploadRequest,
  ): Promise<MediaAssetUploadResponse> {
    await this.courseDocumentsService.ensureCourseHasCapacity(access);

    return this.mediaAssetUploadService.requestUpload({
      ...uploadRequest,
      uploaderId: access.userId,
    });
  }

  async createFileDocument(
    access: CourseAccessParams,
    { mediaAssetId, title }: CreateCourseFileDocumentDto,
  ): Promise<CreatedCourseDocumentResponse> {
    const asset = await this.mediaAssetUploadService.getVerifiedPendingAsset({
      mediaAssetId,
      uploaderId: access.userId,
    });
    const result =
      await this.courseDocumentsRepository.createFileDocumentFromPendingAsset(
        access,
        { title: title ?? asset.originalName, mediaAssetId: asset.id },
        COURSE_DOCUMENTS.MAX_PER_COURSE,
      );

    return this.courseDocumentsService.toCreatedDocument(result);
  }
}
