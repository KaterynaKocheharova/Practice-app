import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { CREATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/create-student.swagger';
import { CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/create-student-language-course.swagger';
import { GET_AVAILABLE_COURSE_LANGUAGES_SWAGGER } from 'src/constant/swagger/students/get-available-course-languages.swagger';
import { GET_STUDENT_BY_ID_SWAGGER } from 'src/constant/swagger/students/get-student-by-id.swagger';
import { GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER } from 'src/constant/swagger/students/get-student-language-course-by-id.swagger';
import { GET_STUDENT_LANGUAGE_COURSES_SWAGGER } from 'src/constant/swagger/students/get-student-language-courses.swagger';
import { GET_STUDENTS_SWAGGER } from 'src/constant/swagger/students/get-students.swagger';
import { STUDENTS_SWAGGER } from 'src/constant/swagger/students/students.swagger';
import { UserRole } from '../../users/enums';
import type { CurrentUserResponse } from '../../users/types';
import type { Language } from '../enums';
import {
  CreateStudentDto,
  CreateStudentLanguageCourseDto,
  GetStudentLanguageCoursesQueryDto,
  GetStudentsQueryDto,
} from '../dto';
import { ManagedStudentGuard, StudentAccessGuard } from '../guards';
import { StudentLanguageCoursesService, StudentsService } from '../services';
import type {
  CreatedStudentLanguageCourseResponse,
  CreatedStudentResponse,
  StudentDetailsResponse,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  StudentLanguageCourseStudentViewResponse,
  StudentsPageResponse,
} from '../types';

@ApiTags(STUDENTS_SWAGGER.TAG)
@Controller(API_ROUTES.STUDENTS.ROOT)
@UseGuards(JwtAccessGuard, RolesGuard)
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly studentLanguageCoursesService: StudentLanguageCoursesService,
  ) {}

  @Post()
  @Roles(UserRole.Teacher)
  @ApiOperation({
    summary: CREATE_STUDENT_SWAGGER.SUMMARY,
    description: CREATE_STUDENT_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(CREATE_STUDENT_SWAGGER.COOKIE_AUTH_NAME)
  @ApiBody({
    type: CreateStudentDto,
    description: CREATE_STUDENT_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description: CREATE_STUDENT_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: { example: CREATE_STUDENT_SWAGGER.CREATED_RESPONSE_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: CREATE_STUDENT_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: { example: CREATE_STUDENT_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE },
  })
  @ApiUnauthorizedResponse({
    description: CREATE_STUDENT_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: { example: CREATE_STUDENT_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE },
  })
  @ApiForbiddenResponse({
    description: CREATE_STUDENT_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
  })
  @ApiConflictResponse({
    description: CREATE_STUDENT_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: { example: CREATE_STUDENT_SWAGGER.CONFLICT_RESPONSE_EXAMPLE },
  })
  createStudent(
    @CurrentUser() teacher: CurrentUserResponse,
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<CreatedStudentResponse> {
    return this.studentsService.createStudent(teacher.id, createStudentDto);
  }

  @Get()
  @Roles(UserRole.Teacher)
  @ApiOperation({
    summary: GET_STUDENTS_SWAGGER.SUMMARY,
    description: GET_STUDENTS_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_STUDENTS_SWAGGER.COOKIE_AUTH_NAME)
  @ApiOkResponse({
    description: GET_STUDENTS_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: GET_STUDENTS_SWAGGER.OK_RESPONSE_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: GET_STUDENTS_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: GET_STUDENTS_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: { example: GET_STUDENTS_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE },
  })
  @ApiForbiddenResponse({
    description: GET_STUDENTS_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
  })
  getStudents(
    @CurrentUser() teacher: CurrentUserResponse,
    @Query() query: GetStudentsQueryDto,
  ): Promise<StudentsPageResponse> {
    return this.studentsService.getTeacherStudents(teacher.id, query);
  }

  @Get(API_ROUTES.STUDENTS.STUDENT_BY_ID)
  @Roles(UserRole.Teacher, UserRole.Student)
  @UseGuards(StudentAccessGuard)
  @ApiOperation({
    summary: GET_STUDENT_BY_ID_SWAGGER.SUMMARY,
    description: GET_STUDENT_BY_ID_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_STUDENT_BY_ID_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: GET_STUDENT_BY_ID_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description: GET_STUDENT_BY_ID_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: GET_STUDENT_BY_ID_SWAGGER.OK_RESPONSE_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: GET_STUDENT_BY_ID_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: GET_STUDENT_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_STUDENT_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiNotFoundResponse({
    description: GET_STUDENT_BY_ID_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: GET_STUDENT_BY_ID_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE },
  })
  getStudentById(
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
  ): Promise<StudentDetailsResponse> {
    return this.studentsService.getStudentDetails(studentId);
  }

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
}
