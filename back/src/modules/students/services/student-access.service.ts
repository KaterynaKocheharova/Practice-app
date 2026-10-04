import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { UserRole } from '../../users/enums';
import { StudentsRepository } from '../repositories';
import type { ManagedStudentLookupParams, StudentAccessParams } from '../types';

/**
 * Access policy for student data: the student themselves, or a teacher the
 * student belongs to. Denials are 404 so callers cannot probe student ids.
 */
@Injectable()
export class StudentAccessService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async ensureStudentIsAccessible({
    viewer,
    studentId,
  }: StudentAccessParams): Promise<void> {
    if (this.isStudentSelf({ viewer, studentId })) {
      return;
    }

    if (viewer.role !== UserRole.Teacher) {
      throw this.createStudentNotFoundException();
    }

    await this.ensureStudentIsManagedByTeacher({
      studentId,
      teacherId: viewer.id,
    });
  }

  async ensureStudentIsManagedByTeacher(
    params: ManagedStudentLookupParams,
  ): Promise<void> {
    const studentId = await this.studentsRepository.getManagedStudentId(params);

    if (!studentId) {
      throw this.createStudentNotFoundException();
    }
  }

  isStudentSelf({ viewer, studentId }: StudentAccessParams): boolean {
    return viewer.id === studentId;
  }

  private createStudentNotFoundException(): NotFoundException {
    return new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
  }
}
