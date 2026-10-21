import { Injectable } from '@nestjs/common';

import { UserStatus } from '../../users/enums';
import type { StudentAccessParams, StudentEditAccessData } from '../types';

@Injectable()
export class StudentAccessService {
  isStudentEditable(
    access: StudentAccessParams,
    student: StudentEditAccessData,
  ): boolean {
    if (this.isStudentSelf(access)) {
      return !this.isManaged(student);
    }

    return (
      this.isCreatedByTeacher(student, access.viewer.id) &&
      this.isManaged(student)
    );
  }

  isStudentSelf({ viewer, studentId }: StudentAccessParams): boolean {
    return viewer.id === studentId;
  }

  private isManaged({ status }: StudentEditAccessData): boolean {
    return status === UserStatus.Managed;
  }

  private isCreatedByTeacher(
    { createdByTeacherId }: StudentEditAccessData,
    teacherId: string,
  ): boolean {
    return createdByTeacherId === teacherId;
  }
}
