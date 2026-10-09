import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { CourseDocumentsRepository } from '../repositories';
import type {
  CourseDocumentActionParams,
  CourseDocumentAuthorData,
} from '../types';

/**
 * Delete policy for course documents: only the user who added a document may
 * delete it. Unknown documents are 404; documents someone else added are 403.
 */
@Injectable()
export class CourseDocumentAccessService {
  constructor(
    private readonly courseDocumentsRepository: CourseDocumentsRepository,
  ) {}

  async ensureCourseDocumentIsDeletable(
    params: CourseDocumentActionParams,
  ): Promise<void> {
    const author =
      await this.courseDocumentsRepository.getCourseDocumentAuthor(params);

    if (!author) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND,
      });
    }

    if (!this.isAddedBy(author, params.userId)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.COURSE_DOCUMENT_DELETE_FORBIDDEN,
      });
    }
  }

  private isAddedBy(
    { addedByUserId }: CourseDocumentAuthorData,
    userId: string,
  ): boolean {
    return addedByUserId === userId;
  }
}
