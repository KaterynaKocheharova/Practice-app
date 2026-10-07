import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { StudentAccessService } from '../services/student-access.service';
import { parseStudentIdParam } from './student-id-param.util';

/**
 * Allows the route's student to edit themselves once they are no longer
 * managed, or the creating teacher while the student is still managed.
 * Must run after JwtAccessGuard, which populates `request.user`.
 */
@Injectable()
export class StudentEditGuard implements CanActivate {
  constructor(private readonly studentAccessService: StudentAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const studentId = await parseStudentIdParam(request);

    await this.studentAccessService.ensureStudentIsEditable({
      viewer: request.user,
      studentId,
    });

    return true;
  }
}
