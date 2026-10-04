import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { StudentAccessService } from '../services/student-access.service';
import { parseStudentIdParam } from './student-id-param.util';

/**
 * Allows the request only if the route's student belongs to the current teacher.
 * Must run after JwtAccessGuard, which populates `request.user`.
 */
@Injectable()
export class ManagedStudentGuard implements CanActivate {
  constructor(private readonly studentAccessService: StudentAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const studentId = await parseStudentIdParam(request);

    await this.studentAccessService.ensureStudentIsManagedByTeacher({
      studentId,
      teacherId: request.user.id,
    });

    return true;
  }
}
