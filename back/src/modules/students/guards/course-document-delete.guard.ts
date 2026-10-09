import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { CourseDocumentAccessService } from '../services/course-document-access.service';
import { parseCourseIdParam } from './course-id-param.util';
import { parseDocumentIdParam } from './document-id-param.util';

/**
 * Allows deleting the route's document only to the user who added it.
 * Must run after JwtAccessGuard (populates `request.user`) and
 * StudentLanguageCourseAccessGuard (checks access to the course).
 */
@Injectable()
export class CourseDocumentDeleteGuard implements CanActivate {
  constructor(
    private readonly courseDocumentAccessService: CourseDocumentAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [courseId, documentId] = await Promise.all([
      parseCourseIdParam(request),
      parseDocumentIdParam(request),
    ]);

    await this.courseDocumentAccessService.ensureCourseDocumentIsDeletable({
      courseId,
      documentId,
      userId: request.user.id,
    });

    return true;
  }
}
