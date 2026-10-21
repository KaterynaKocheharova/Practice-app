import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import type {
  CreateStudentLanguageCourseDto,
  UpdateStudentLanguageCourseDto,
} from '../dto';
import { Language } from '../enums';
import {
  StudentLanguageCoursesRepository,
  StudentsRepository,
} from '../repositories';
import type {
  CreatedStudentLanguageCourseResponse,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  StudentLanguageCourseKey,
  StudentLanguageCoursesFilterParams,
  StudentLanguageCourseStudentViewResponse,
  StudentLanguageCourseViewParams,
  TeacherStudentLanguageCourseLookupParams,
  TeacherStudentLookupParams,
  UpdatedStudentLanguageCourseResponse,
  WithCourseDocuments,
} from '../types';
import { CourseDocumentsService } from './course-documents.service';
import { StudentAccessService } from './student-access.service';

@Injectable()
export class StudentLanguageCoursesService {
  constructor(
    private readonly studentLanguageCoursesRepository: StudentLanguageCoursesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly studentAccessService: StudentAccessService,
    private readonly courseDocumentsService: CourseDocumentsService,
  ) {}

  async createStudentLanguageCourse(
    { studentId, teacherId }: TeacherStudentLookupParams,
    createCourseDto: CreateStudentLanguageCourseDto,
  ): Promise<CreatedStudentLanguageCourseResponse> {
    await this.ensureTeacherStudentExists({ studentId, teacherId });
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
    params: TeacherStudentLookupParams,
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
   * The student gets the course without the teacher's comments. Both views
   * always include the course documents.
   */
  async getStudentLanguageCourse({
    courseId,
    ...access
  }: StudentLanguageCourseViewParams): Promise<
    WithCourseDocuments<
      | StudentLanguageCourseDetailsResponse
      | StudentLanguageCourseStudentViewResponse
    >
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

    const documents = await this.courseDocumentsService.getCourseDocuments({
      courseId,
      userId: viewer.id,
    });

    return { ...course, documents };
  }

  /** Only the teacher who runs the course can edit it; others get 404. */
  async updateStudentLanguageCourse(
    params: TeacherStudentLanguageCourseLookupParams,
    updateCourseDto: UpdateStudentLanguageCourseDto,
  ): Promise<UpdatedStudentLanguageCourseResponse> {
    const course =
      await this.studentLanguageCoursesRepository.updateTeacherStudentLanguageCourse(
        params,
        updateCourseDto,
      );

    if (!course) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
      });
    }

    return course;
  }

  private async ensureTeacherStudentExists(
    params: TeacherStudentLookupParams,
  ): Promise<void> {
    const studentId = await this.studentsRepository.getTeacherStudentId(params);

    if (!studentId) {
      throw new NotFoundException({ errorCode: ERROR_CODE.STUDENT_NOT_FOUND });
    }
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
