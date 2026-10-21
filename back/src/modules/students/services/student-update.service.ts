import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import type { UpdateStudentDto } from '../dto';
import { StudentsRepository } from '../repositories';
import type {
  StudentAccessParams,
  UpdatedStudentResponse,
  UpdateStudentData,
} from '../types';
import { StudentAccessService } from './student-access.service';

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
    const { viewer, studentId } = access;
    const data = this.toUpdateStudentData(updateStudentDto);

    const student = this.studentAccessService.isStudentSelf(access)
      ? await this.studentsRepository.updateOwnStudent(studentId, data)
      : await this.studentsRepository.updateStudentAsCreator(
          { studentId, teacherId: viewer.id },
          data,
        );

    if (!student) {
      throw new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
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
