import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { UsersService } from '../../users/services/users.service';
import type { UpdateStudentDto } from '../dto';
import { StudentsRepository } from '../repositories';
import type {
  StudentAccessParams,
  UpdatedStudentResponse,
  UpdateStudentData,
} from '../types';
import { StudentAccessService } from './student-access.service';

/**
 * Transaction script for editing a student. Who may edit is decided by
 * StudentEditGuard; this service applies the per-editor field rules.
 */
@Injectable()
export class StudentUpdateService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly studentAccessService: StudentAccessService,
    private readonly usersService: UsersService,
  ) {}

  async updateStudent(
    access: StudentAccessParams,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UpdatedStudentResponse> {
    const data = this.toUpdateStudentData(updateStudentDto);

    return this.studentAccessService.isStudentSelf(access)
      ? this.updateOwnProfile(access.studentId, data)
      : this.updateAsCreator(access, data);
  }

  /** Once the student has their own account, the email belongs to auth. */
  private updateOwnProfile(
    studentId: string,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse> {
    if (data.user.email !== undefined) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.STUDENT_EMAIL_NOT_EDITABLE,
      });
    }

    return this.studentsRepository.updateStudent(studentId, data);
  }

  private async updateAsCreator(
    { viewer, studentId }: StudentAccessParams,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse> {
    await this.ensureEmailIsAvailable(studentId, data.user.email);

    const student = await this.studentsRepository.updateStudentAsCreator(
      { studentId, teacherId: viewer.id },
      data,
    );

    if (!student) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.STUDENT_NOT_EDITABLE,
      });
    }

    return student;
  }

  private async ensureEmailIsAvailable(
    studentId: string,
    email: UpdateStudentData['user']['email'],
  ): Promise<void> {
    if (!email) {
      return;
    }

    const existingUserId = await this.usersService.getUserIdByEmail(email);

    if (existingUserId && existingUserId !== studentId) {
      throw new ConflictException({
        errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
      });
    }
  }

  private toUpdateStudentData({
    name,
    email,
    birthDate,
    job,
    hobbies,
  }: UpdateStudentDto): UpdateStudentData {
    return {
      user: { name, email },
      student: { birthDate, job, hobbies },
    };
  }
}
