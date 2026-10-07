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
import { CREATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/create-student.swagger';
import { GET_STUDENT_BY_ID_SWAGGER } from 'src/constant/swagger/students/get-student-by-id.swagger';
import { GET_STUDENTS_SWAGGER } from 'src/constant/swagger/students/get-students.swagger';
import { STUDENTS_SWAGGER } from 'src/constant/swagger/students/students.swagger';
import { UPDATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/update-student.swagger';
import { UserRole } from '../../users/enums';
import type { CurrentUserResponse } from '../../users/types';
import {
  CreateStudentDto,
  GetStudentsQueryDto,
  UpdateStudentDto,
} from '../dto';
import { StudentAccessGuard, StudentEditGuard } from '../guards';
import { StudentsService, StudentUpdateService } from '../services';
import type {
  CreatedStudentResponse,
  StudentDetailsResponse,
  StudentsPageResponse,
  UpdatedStudentResponse,
} from '../types';

@ApiTags(STUDENTS_SWAGGER.TAG)
@Controller(API_ROUTES.STUDENTS.ROOT)
@UseGuards(JwtAccessGuard, RolesGuard)
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly studentUpdateService: StudentUpdateService,
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

  @Patch(API_ROUTES.STUDENTS.STUDENT_BY_ID)
  @Roles(UserRole.Teacher, UserRole.Student)
  @UseGuards(StudentEditGuard)
  @ApiOperation({
    summary: UPDATE_STUDENT_SWAGGER.SUMMARY,
    description: UPDATE_STUDENT_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(UPDATE_STUDENT_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: API_ROUTES.STUDENTS.PARAMS.STUDENT_ID,
    type: String,
    format: 'uuid',
    description: UPDATE_STUDENT_SWAGGER.STUDENT_ID_DESCRIPTION,
  })
  @ApiBody({
    type: UpdateStudentDto,
    description: UPDATE_STUDENT_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiOkResponse({
    description: UPDATE_STUDENT_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.OK_RESPONSE_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: UPDATE_STUDENT_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE },
  })
  @ApiUnauthorizedResponse({
    description: UPDATE_STUDENT_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE },
  })
  @ApiForbiddenResponse({
    description: UPDATE_STUDENT_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.FORBIDDEN_RESPONSE_EXAMPLE },
  })
  @ApiNotFoundResponse({
    description: UPDATE_STUDENT_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE },
  })
  @ApiConflictResponse({
    description: UPDATE_STUDENT_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_STUDENT_SWAGGER.CONFLICT_RESPONSE_EXAMPLE },
  })
  updateStudent(
    @CurrentUser() viewer: CurrentUserResponse,
    @Param(API_ROUTES.STUDENTS.PARAMS.STUDENT_ID, ParseUUIDPipe)
    studentId: string,
    @Body(NonEmptyBodyPipe) updateStudentDto: UpdateStudentDto,
  ): Promise<UpdatedStudentResponse> {
    return this.studentUpdateService.updateStudent(
      { viewer, studentId },
      updateStudentDto,
    );
  }
}
