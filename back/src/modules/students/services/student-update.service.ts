import { ForbiddenException, Injectable } from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
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
 * StudentEditGuard; this service picks the write for that editor.
 */
@Injectable()
export class StudentUpdateService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly studentAccessService: StudentAccessService,
  ) {}

  async updateStudent(
    access: StudentAccessParams,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UpdatedStudentResponse> {
    const data = this.toUpdateStudentData(updateStudentDto);

    return this.studentAccessService.isStudentSelf(access)
      ? this.studentsRepository.updateStudent(access.studentId, data)
      : this.updateAsCreator(access, data);
  }

  private async updateAsCreator(
    { viewer, studentId }: StudentAccessParams,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse> {
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

  private toUpdateStudentData({
    name,
    birthDate,
    job,
    hobbies,
  }: UpdateStudentDto): UpdateStudentData {
    return {
      user: { name },
      student: { birthDate, job, hobbies },
    };
  }
}
