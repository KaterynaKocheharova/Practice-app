import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { TeachersService } from '../../teachers/services';
import { UserRole, UserStatus } from '../../users/enums';
import type { CreateStudentDto, GetStudentsQueryDto } from '../dto';
import { StudentsRepository } from '../repositories';
import type {
  CreatedStudentResponse,
  StudentAccessParams,
  StudentDetailsViewResponse,
  StudentsPageResponse,
} from '../types';
import { StudentAccessService } from './student-access.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly studentAccessService: StudentAccessService,
    private readonly teachersService: TeachersService,
  ) {}

  async createStudent(
    teacherId: string,
    { name, birthDate, job, hobbies }: CreateStudentDto,
  ): Promise<CreatedStudentResponse> {
    await this.ensureTeacherExists(teacherId);

    return this.studentsRepository.createManagedStudent({
      user: {
        name,
        role: UserRole.Student,
        status: UserStatus.Managed,
      },
      student: {
        createdByTeacherId: teacherId,
        birthDate,
        job,
        hobbies,
      },
    });
  }

  async getTeacherStudents(
    teacherId: string,
    { limit, offset, search }: GetStudentsQueryDto,
  ): Promise<StudentsPageResponse> {
    const filter = { teacherId, search: search ?? null };
    const [items, total] = await Promise.all([
      this.studentsRepository.getTeacherStudentCards({
        ...filter,
        limit,
        offset,
      }),
      this.studentsRepository.countTeacherStudents(filter),
    ]);

    return { items, total };
  }

  /** Access is checked by StudentAccessGuard; this adds the viewer's edit flag. */
  async getStudentDetails(
    access: StudentAccessParams,
  ): Promise<StudentDetailsViewResponse> {
    const student =
      await this.studentsRepository.getStudentDetailsWithEditAccess(
        access.studentId,
      );

    if (!student) {
      throw new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
    }

    const { createdByTeacherId, ...details } = student;

    return {
      ...details,
      isEditable: this.studentAccessService.isStudentEditable(access, {
        createdByTeacherId,
        status: details.status,
      }),
    };
  }

  private async ensureTeacherExists(teacherId: string): Promise<void> {
    const teacher = await this.teachersService.getTeacherByUserId(teacherId);

    if (!teacher) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.TEACHER_NOT_FOUND,
      });
    }
  }
}
