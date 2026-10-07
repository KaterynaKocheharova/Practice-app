import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAccessGuard,
  Roles,
  RolesGuard,
} from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { NonEmptyBodyPipe } from 'src/common/pipes';
import { CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/create-student-language-course.swagger';
import { GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER } from 'src/constant/swagger/students/get-available-course-languages.swagger';
import { GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER } from 'src/constant/swagger/students/get-student-language-course-by-id.swagger';
import { GET_STUDENT_LANGUAGE_COURSES_SWAGGER } from 'src/constant/swagger/students/get-student-language-courses.swagger';
import { STUDENTS_SWAGGER } from 'src/constant/swagger/students/students.swagger';
import { UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/update-student-language-course.swagger';
import { UserRole } from '../../users/enums';
import type { CurrentUserResponse } from '../../users/types';
import type { Language } from '../enums';
import {
  CreateStudentLanguageCourseDto,
  GetStudentLanguageCoursesQueryDto,
  UpdateStudentLanguageCourseDto,
} from '../dto';
import { ManagedStudentGuard, StudentAccessGuard } from '../guards';
import { StudentLanguageCoursesService } from '../services';
import type {
  CreatedStudentLanguageCourseResponse,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  StudentLanguageCourseStudentViewResponse,
  UpdatedStudentLanguageCourseResponse,
} from '../types';

/** A student's language courses, nested under `students/:studentId/courses`. */
@ApiTags(STUDENTS_SWAGGER.TAG)
@Controller(API_ROUTES.STUDENTS.ROOT)
@UseGuards(JwtAccessGuard, RolesGuard)
export class StudentLanguageCoursesController {
  constructor(
    private readonly studentLanguageCoursesService: StudentLanguageCoursesService,
  ) {}

  @Post(API_ROUTES.STUDENTS.LANGUAGE_COURSES)
  @Roles(UserRole.Teacher)
  @UseGuards(ManagedStudentGuard)
  @ApiOperation({
    summary: CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.SUMMARY,
    description: CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiBody({
    type: CreateStudentLanguageCourseDto,
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: {
      example: CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.CREATED_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiForbiddenResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example:
        CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  @ApiConflictResponse({
    description:
      CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: {
      example: CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER.CONFLICT_RESPONSE_EXAMPLE,
    },
  })
  createStudentLanguageCourse(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
    @Body() createCourseDto: CreateStudentLanguageCourseDto,
  ): Promise<CreatedStudentLanguageCourseResponse> {
    return this.studentLanguageCoursesService.createStudentLanguageCourse(
      { studentId, teacherId: teacher.id },
      createCourseDto,
    );
  }

  @Get(API_ROUTES.STUDENTS.AVAILABLE_COURSE_LANGUAGES)
  @Roles(UserRole.Teacher)
  @UseGuards(ManagedStudentGuard)
  @ApiOperation({
    summary: GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.SUMMARY,
    description: GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description: GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiForbiddenResponse({
    description:
      GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example:
        GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  getAvailableCourseLanguages(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
  ): Promise<Language[]> {
    return this.studentLanguageCoursesService.getAvailableCourseLanguages({
      studentId,
      teacherId: teacher.id,
    });
  }

  @Get(API_ROUTES.STUDENTS.LANGUAGE_COURSES)
  @Roles(UserRole.Teacher, UserRole.Student)
  @UseGuards(StudentAccessGuard)
  @ApiOperation({
    summary: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.SUMMARY,
    description: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_STUDENT_LANGUAGE_COURSES_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSES_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSES_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        GET_STUDENT_LANGUAGE_COURSES_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiNotFoundResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSES_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_STUDENT_LANGUAGE_COURSES_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  getStudentLanguageCourses(
    @CurrentUser() viewer: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
    @Query() { language }: GetStudentLanguageCoursesQueryDto,
  ): Promise<StudentLanguageCourseCardResponse[]> {
    return this.studentLanguageCoursesService.getStudentLanguageCourses({
      viewer,
      studentId,
      language: language ?? null,
    });
  }

  @Get(API_ROUTES.STUDENTS.LANGUAGE_COURSE_BY_ID)
  @Roles(UserRole.Teacher, UserRole.Student)
  @UseGuards(StudentAccessGuard)
  @ApiOperation({
    summary: GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.SUMMARY,
    description: GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.COURSE_ID,
    type: String,
    format: 'uuid',
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.COURSE_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiNotFoundResponse({
    description:
      GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example:
        GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  getStudentLanguageCourseById(
    @CurrentUser() viewer: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
    @Param(API_ROUTES.STUDENTS.PARAMS.COURSE_ID, ParseUUIDPipe)
    courseId: string,
  ): Promise<
    | StudentLanguageCourseDetailsResponse
    | StudentLanguageCourseStudentViewResponse
  > {
    return this.studentLanguageCoursesService.getStudentLanguageCourse({
      viewer,
      studentId,
      courseId,
    });
  }

  @Patch(API_ROUTES.STUDENTS.LANGUAGE_COURSE_BY_ID)
  @Roles(UserRole.Teacher)
  @ApiOperation({
    summary: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.SUMMARY,
    description: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.COURSE_ID,
    type: String,
    format: 'uuid',
    description: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.COURSE_ID_DESCRIPTION,
  })
  @ApiBody({
    type: UpdateStudentLanguageCourseDto,
    description:
      UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiOkResponse({
    description: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example:
        UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description:
      UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiForbiddenResponse({
    description:
      UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example:
        UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  updateStudentLanguageCourse(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
    @Param(API_ROUTES.STUDENTS.PARAMS.COURSE_ID, ParseUUIDPipe)
    courseId: string,
    @Body(NonEmptyBodyPipe) updateCourseDto: UpdateStudentLanguageCourseDto,
  ): Promise<UpdatedStudentLanguageCourseResponse> {
    return this.studentLanguageCoursesService.updateStudentLanguageCourse(
      { courseId, studentId, teacherId: teacher.id },
      updateCourseDto,
    );
  }
}
