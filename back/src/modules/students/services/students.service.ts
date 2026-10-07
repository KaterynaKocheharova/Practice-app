import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { TeachersRepository } from '../../teachers/repositories';
import { UserRole, UserStatus } from '../../users/enums';
import { UsersService } from '../../users/services/users.service';
import type { CreateStudentDto, GetStudentsQueryDto } from '../dto';
import { StudentsRepository } from '../repositories';
import type {
  CreatedStudentResponse,
  StudentDetailsResponse,
  StudentsPageResponse,
} from '../types';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly teachersRepository: TeachersRepository,
    private readonly usersService: UsersService,
  ) {}

  async createStudent(
    teacherId: string,
    createStudentDto: CreateStudentDto,
  ): Promise<CreatedStudentResponse> {
    await this.ensureTeacherExists(teacherId);
    await this.ensureEmailIsAvailable(createStudentDto.email);

    const { name, email, birthDate, job, hobbies } = createStudentDto;

    return this.studentsRepository.createManagedStudent({
      user: {
        name,
        email,
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

  async getStudentDetails(studentId: string): Promise<StudentDetailsResponse> {
    const student =
      await this.studentsRepository.getStudentDetailsById(studentId);

    if (!student) {
      throw new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
    }

    return student;
  }

  private async ensureTeacherExists(teacherId: string): Promise<void> {
    const teacher = await this.teachersRepository.getTeacherByUserId(teacherId);

    if (!teacher) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.TEACHER_NOT_FOUND,
      });
    }
  }

  private async ensureEmailIsAvailable(email?: string): Promise<void> {
    if (!email) {
      return;
    }

    const existingUserId = await this.usersService.getUserIdByEmail(email);

    if (existingUserId) {
      throw new ConflictException({
        errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
      });
    }
  }
}
