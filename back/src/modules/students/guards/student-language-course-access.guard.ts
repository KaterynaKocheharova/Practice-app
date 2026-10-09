import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { StudentLanguageCourseAccessService } from '../services/student-language-course-access.service';
import { parseCourseIdParam } from './course-id-param.util';
import { parseStudentIdParam } from './student-id-param.util';

/**
 * Allows the route's course to its student, or to the teacher who runs it.
 * Must run after JwtAccessGuard, which populates `request.user`.
 */
@Injectable()
export class StudentLanguageCourseAccessGuard implements CanActivate {
  constructor(
    private readonly studentLanguageCourseAccessService: StudentLanguageCourseAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [studentId, courseId] = await Promise.all([
      parseStudentIdParam(request),
      parseCourseIdParam(request),
    ]);

    await this.studentLanguageCourseAccessService.ensureCourseIsAccessible({
      viewer: request.user,
      studentId,
      courseId,
    });

    return true;
  }
}
