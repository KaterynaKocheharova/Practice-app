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

  /** Access is checked by StudentAccessGuard; this adds the viewer's edit flag. */
  async getStudentDetails(
    access: StudentAccessParams,
  ): Promise<StudentDetailsViewResponse> {
    const [student, editAccess] = await Promise.all([
      this.studentsRepository.getStudentDetailsById(access.studentId),
      this.studentsRepository.getStudentEditAccess(access.studentId),
    ]);

    if (!student || !editAccess) {
      throw new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
    }

    return {
      ...student,
      isEditable: this.studentAccessService.isStudentEditable(
        access,
        editAccess,
      ),
    };
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
