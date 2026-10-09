import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { StudentLanguageCoursesRepository } from '../repositories';
import type { StudentLanguageCourseViewParams } from '../types';
import { StudentAccessService } from './student-access.service';

/**
 * Course-level access, matching the course details view: the student reaches
 * all their courses, a teacher only the ones they run. Denials are 404.
 */
@Injectable()
export class StudentLanguageCourseAccessService {
  constructor(
    private readonly studentLanguageCoursesRepository: StudentLanguageCoursesRepository,
    private readonly studentAccessService: StudentAccessService,
  ) {}

  async ensureCourseIsAccessible({
    courseId,
    ...access
  }: StudentLanguageCourseViewParams): Promise<void> {
    const { viewer, studentId } = access;
    const accessibleCourseId = this.studentAccessService.isStudentSelf(access)
      ? await this.studentLanguageCoursesRepository.getStudentCourseId({
          courseId,
          studentId,
        })
      : await this.studentLanguageCoursesRepository.getTeacherStudentCourseId({
          courseId,
          studentId,
          teacherId: viewer.id,
        });

    if (!accessibleCourseId) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
      });
    }
  }
}
