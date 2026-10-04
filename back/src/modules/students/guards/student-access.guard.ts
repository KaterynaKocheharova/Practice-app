import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { StudentAccessService } from '../services/student-access.service';
import { parseStudentIdParam } from './student-id-param.util';

/**
 * Allows the route's student themselves, or a teacher the student belongs to.
 * Must run after JwtAccessGuard, which populates `request.user`.
 */
@Injectable()
export class StudentAccessGuard implements CanActivate {
  constructor(private readonly studentAccessService: StudentAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const studentId = await parseStudentIdParam(request);

    await this.studentAccessService.ensureStudentIsAccessible({
      viewer: request.user,
      studentId,
    });

    return true;
  }
}
