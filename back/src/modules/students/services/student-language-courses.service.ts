import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import type { CreateStudentLanguageCourseDto } from '../dto';
import { Language } from '../enums';
import { StudentLanguageCoursesRepository } from '../repositories';
import type {
  CreatedStudentLanguageCourseResponse,
  ManagedStudentLookupParams,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  StudentLanguageCourseKey,
  StudentLanguageCoursesFilterParams,
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
   * Languages the teacher can still open a course in: one course per
   * language per teacher and student.
   */
  async getAvailableCourseLanguages(
    params: ManagedStudentLookupParams,
  ): Promise<Language[]> {
    const takenLanguages = new Set(
      await this.studentLanguageCoursesRepository.getTeacherStudentCourseLanguages(
        params,
      ),
    );

    return Object.values(Language).filter(
      (language) => !takenLanguages.has(language),
    );
  }

  /**
   * The student sees all their courses; a teacher only the ones they run.
   * Both can narrow the list to one language.
   */
  getStudentLanguageCourses({
    language,
    ...access
  }: StudentLanguageCoursesFilterParams): Promise<
    StudentLanguageCourseCardResponse[]
  > {
    const { viewer, studentId } = access;

    return this.studentAccessService.isStudentSelf(access)
      ? this.studentLanguageCoursesRepository.getStudentLanguageCourseCards({
          studentId,
          language,
        })
      : this.studentLanguageCoursesRepository.getTeacherStudentLanguageCourseCards(
          { studentId, teacherId: viewer.id, language },
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
