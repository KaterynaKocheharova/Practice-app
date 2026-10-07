import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { UserRole, UserStatus } from '../../users/enums';
import { StudentsRepository } from '../repositories';
import type {
  ManagedStudentLookupParams,
  StudentAccessParams,
  StudentEditAccessData,
} from '../types';

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

  /**
   * Edit policy: the student edits themselves once they have their own
   * account; the creating teacher edits only while the student is managed.
   * Other users get 404, the creating teacher of an activated student 403.
   */
  async ensureStudentIsEditable(access: StudentAccessParams): Promise<void> {
    const student = await this.studentsRepository.getStudentEditAccess(
      access.studentId,
    );

    if (!student || !this.isEditorCandidate(access, student)) {
      throw this.createStudentNotFoundException();
    }

    if (!this.isStudentEditable(access, student)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.STUDENT_NOT_EDITABLE,
      });
    }
  }

  /** The edit policy as a flag, for clients deciding whether to offer editing. */
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

  /** Only the student or their creating teacher may ever edit them. */
  private isEditorCandidate(
    access: StudentAccessParams,
    student: StudentEditAccessData,
  ): boolean {
    return (
      this.isStudentSelf(access) ||
      this.isCreatedByTeacher(student, access.viewer.id)
    );
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

  private createStudentNotFoundException(): NotFoundException {
    return new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
  }
}
