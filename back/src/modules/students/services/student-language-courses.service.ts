import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import type { CreateStudentLanguageCourseDto } from '../dto';
import { StudentLanguageCoursesRepository } from '../repositories';
import type {
  CreatedStudentLanguageCourseResponse,
  ManagedStudentLookupParams,
  StudentAccessParams,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  StudentLanguageCourseKey,
  StudentLanguageCourseStudentViewResponse,
  StudentLanguageCourseViewParams,
} from '../types';
import { StudentAccessService } from './student-access.service';

@Injectable()
export class StudentLanguageCoursesService {
  constructor(
    private readonly studentLanguageCoursesRepository: StudentLanguageCoursesRepository,
    private readonly studentAccessService: StudentAccessService,
  ) {}

  async createStudentLanguageCourse(
    { studentId, teacherId }: ManagedStudentLookupParams,
    createCourseDto: CreateStudentLanguageCourseDto,
  ): Promise<CreatedStudentLanguageCourseResponse> {
    await this.ensureCourseDoesNotExist({
      studentId,
      teacherId,
      language: createCourseDto.language,
    });

    return this.studentLanguageCoursesRepository.createStudentLanguageCourse({
      ...createCourseDto,
      studentId,
      teacherId,
    });
  }

  /**
   * The student sees all their courses; a teacher only the ones they run.
   */
  getStudentLanguageCourses(
    access: StudentAccessParams,
  ): Promise<StudentLanguageCourseCardResponse[]> {
    const { viewer, studentId } = access;

    return this.studentAccessService.isStudentSelf(access)
      ? this.studentLanguageCoursesRepository.getStudentLanguageCourseCards(
          studentId,
        )
      : this.studentLanguageCoursesRepository.getTeacherStudentLanguageCourseCards(
          { studentId, teacherId: viewer.id },
        );
  }

  /**
   * The student gets the course without the teacher's comments.
   */
  async getStudentLanguageCourse({
    courseId,
    ...access
  }: StudentLanguageCourseViewParams): Promise<
    | StudentLanguageCourseDetailsResponse
    | StudentLanguageCourseStudentViewResponse
  > {
    const { viewer, studentId } = access;
    const course = this.studentAccessService.isStudentSelf(access)
      ? await this.studentLanguageCoursesRepository.getStudentLanguageCourseStudentView(
          { courseId, studentId },
        )
      : await this.studentLanguageCoursesRepository.getStudentLanguageCourseDetails(
          { courseId, studentId, teacherId: viewer.id },
        );

    if (!course) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
      });
    }

    return course;
  }

  private async ensureCourseDoesNotExist(
    key: StudentLanguageCourseKey,
  ): Promise<void> {
    const courseId =
      await this.studentLanguageCoursesRepository.getStudentLanguageCourseId(
        key,
      );

    if (courseId) {
      throw new ConflictException({
        errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS,
      });
    }
  }
}
