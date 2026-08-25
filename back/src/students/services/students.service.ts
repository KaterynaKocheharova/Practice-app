import { BadRequestException, Injectable } from '@nestjs/common';

import { ERROR_CODE } from '../../common/constants/errors/error-code.constant';
import { TeachersRepository } from '../../teachers/repositories';
import { StudentsRepository } from '../repositories';
import type { CreateStudentData, StudentData } from '../types';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly teachersRepository: TeachersRepository,
  ) {}

  async createStudent(student: CreateStudentData): Promise<StudentData> {
    const teacher = await this.teachersRepository.getTeacherByUserId(
      student.teacherId,
    );

    if (!teacher) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.TEACHER_NOT_FOUND,
      });
    }

    return this.studentsRepository.createStudent(student);
  }
}
