import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiNoContentResponse,
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
import { ADD_TEACHER_GOAL_ATTEMPT_SWAGGER } from 'src/constant/swagger/teachers/add-teacher-goal-attempt.swagger';
import { COMPLETE_TEACHER_GOAL_SWAGGER } from 'src/constant/swagger/teachers/complete-teacher-goal.swagger';
import { CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER } from 'src/constant/swagger/teachers/create-teacher-goal-progress-check.swagger';
import { CREATE_TEACHER_GOAL_SWAGGER } from 'src/constant/swagger/teachers/create-teacher-goal.swagger';
import { DELETE_TEACHER_GOAL_SWAGGER } from 'src/constant/swagger/teachers/delete-teacher-goal.swagger';
import { GET_TEACHER_GOALS_SWAGGER } from 'src/constant/swagger/teachers/get-teacher-goals.swagger';
import { TEACHER_GOALS_SWAGGER } from 'src/constant/swagger/teachers/teacher-goals.swagger';
import { UPDATE_TEACHER_GOAL_SWAGGER } from 'src/constant/swagger/teachers/update-teacher-goal.swagger';
import { UserRole } from '../../users/enums';
import type { CurrentUserResponse } from '../../users/types';
import {
  CreateTeacherGoalDto,
  CreateTeacherGoalProgressCheckDto,
  GetTeacherGoalsQueryDto,
  UpdateTeacherGoalDto,
} from '../dto';
import { TeacherGoalsService } from '../services';
import type {
  TeacherGoalIdResponse,
  TeacherGoalProgressCheckIdResponse,
  TeacherGoalsPageResponse,
} from '../types';

const { PARAMS } = API_ROUTES.TEACHERS;
const COMMON = TEACHER_GOALS_SWAGGER;

@ApiTags(COMMON.TAG)
@ApiCookieAuth(COMMON.COOKIE_AUTH_NAME)
@ApiUnauthorizedResponse({
  description: COMMON.UNAUTHORIZED_RESPONSE_DESCRIPTION,
  schema: { example: COMMON.UNAUTHORIZED_RESPONSE_EXAMPLE },
})
@ApiForbiddenResponse({ description: COMMON.FORBIDDEN_RESPONSE_DESCRIPTION })
@Controller(API_ROUTES.TEACHERS.ROOT)
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Teacher)
export class TeacherGoalsController {
  constructor(private readonly teacherGoalsService: TeacherGoalsService) {}

  @Post(API_ROUTES.TEACHERS.MY_GOALS)
  @ApiOperation({
    summary: CREATE_TEACHER_GOAL_SWAGGER.SUMMARY,
    description: CREATE_TEACHER_GOAL_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: CreateTeacherGoalDto,
    description: CREATE_TEACHER_GOAL_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description: CREATE_TEACHER_GOAL_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.GOAL_ID_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: CREATE_TEACHER_GOAL_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiConflictResponse({
    description: CREATE_TEACHER_GOAL_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: { example: CREATE_TEACHER_GOAL_SWAGGER.CONFLICT_RESPONSE_EXAMPLE },
  })
  createTeacherGoal(
    @CurrentUser() teacher: CurrentUserResponse,
    @Body() createGoalDto: CreateTeacherGoalDto,
  ): Promise<TeacherGoalIdResponse> {
    return this.teacherGoalsService.createTeacherGoal(
      teacher.id,
      createGoalDto,
    );
  }

  @Get(API_ROUTES.TEACHERS.MY_GOALS)
  @ApiOperation({
    summary: GET_TEACHER_GOALS_SWAGGER.SUMMARY,
    description: GET_TEACHER_GOALS_SWAGGER.DESCRIPTION,
  })
  @ApiOkResponse({
    description: GET_TEACHER_GOALS_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: GET_TEACHER_GOALS_SWAGGER.OK_RESPONSE_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: GET_TEACHER_GOALS_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  getTeacherGoals(
    @CurrentUser() teacher: CurrentUserResponse,
    @Query() query: GetTeacherGoalsQueryDto,
  ): Promise<TeacherGoalsPageResponse> {
    return this.teacherGoalsService.getTeacherGoals(teacher.id, query);
  }

  @Patch(API_ROUTES.TEACHERS.MY_GOAL_BY_ID)
  @ApiOperation({
    summary: UPDATE_TEACHER_GOAL_SWAGGER.SUMMARY,
    description: UPDATE_TEACHER_GOAL_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.GOAL_ID,
    type: String,
    format: 'uuid',
    description: COMMON.GOAL_ID_DESCRIPTION,
  })
  @ApiBody({
    type: UpdateTeacherGoalDto,
    description: UPDATE_TEACHER_GOAL_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiOkResponse({
    description: UPDATE_TEACHER_GOAL_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.GOAL_ID_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description: UPDATE_TEACHER_GOAL_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: UPDATE_TEACHER_GOAL_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @ApiNotFoundResponse({
    description: COMMON.GOAL_NOT_FOUND_DESCRIPTION,
    schema: { example: COMMON.GOAL_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description: UPDATE_TEACHER_GOAL_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: { example: UPDATE_TEACHER_GOAL_SWAGGER.CONFLICT_RESPONSE_EXAMPLE },
  })
  updateTeacherGoal(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(PARAMS.GOAL_ID, ParseUUIDPipe) goalId: string,
    @Body(NonEmptyBodyPipe) updateGoalDto: UpdateTeacherGoalDto,
  ): Promise<TeacherGoalIdResponse> {
    return this.teacherGoalsService.updateTeacherGoal(
      { goalId, teacherId: teacher.id },
      updateGoalDto,
    );
  }

  @Post(API_ROUTES.TEACHERS.MY_GOAL_ATTEMPTS)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: ADD_TEACHER_GOAL_ATTEMPT_SWAGGER.SUMMARY,
    description: ADD_TEACHER_GOAL_ATTEMPT_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.GOAL_ID,
    type: String,
    format: 'uuid',
    description: COMMON.GOAL_ID_DESCRIPTION,
  })
  @ApiNoContentResponse({
    description:
      ADD_TEACHER_GOAL_ATTEMPT_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({ description: COMMON.BAD_REQUEST_ID_DESCRIPTION })
  @ApiNotFoundResponse({
    description: COMMON.GOAL_NOT_FOUND_DESCRIPTION,
    schema: { example: COMMON.GOAL_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description: `${COMMON.ALREADY_COMPLETED_DESCRIPTION} ${COMMON.PROGRESS_CHECK_PENDING_DESCRIPTION}`,
    schema: { example: COMMON.PROGRESS_CHECK_PENDING_EXAMPLE },
  })
  addTeacherGoalAttempt(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(PARAMS.GOAL_ID, ParseUUIDPipe) goalId: string,
  ): Promise<void> {
    return this.teacherGoalsService.addTeacherGoalAttempt({
      goalId,
      teacherId: teacher.id,
    });
  }

  @Post(API_ROUTES.TEACHERS.MY_GOAL_PROGRESS_CHECKS)
  @ApiOperation({
    summary: CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.SUMMARY,
    description: CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.GOAL_ID,
    type: String,
    format: 'uuid',
    description: COMMON.GOAL_ID_DESCRIPTION,
  })
  @ApiBody({
    type: CreateTeacherGoalProgressCheckDto,
    description:
      CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.CREATED_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: COMMON.GOAL_NOT_FOUND_DESCRIPTION,
    schema: { example: COMMON.GOAL_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description:
      CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: {
      example:
        CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER.CONFLICT_RESPONSE_EXAMPLE,
    },
  })
  createTeacherGoalProgressCheck(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(PARAMS.GOAL_ID, ParseUUIDPipe) goalId: string,
    @Body() createProgressCheckDto: CreateTeacherGoalProgressCheckDto,
  ): Promise<TeacherGoalProgressCheckIdResponse> {
    return this.teacherGoalsService.createTeacherGoalProgressCheck(
      { goalId, teacherId: teacher.id },
      createProgressCheckDto,
    );
  }

  @Post(API_ROUTES.TEACHERS.MY_GOAL_COMPLETION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: COMPLETE_TEACHER_GOAL_SWAGGER.SUMMARY,
    description: COMPLETE_TEACHER_GOAL_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.GOAL_ID,
    type: String,
    format: 'uuid',
    description: COMMON.GOAL_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description: COMPLETE_TEACHER_GOAL_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.GOAL_ID_EXAMPLE },
  })
  @ApiBadRequestResponse({ description: COMMON.BAD_REQUEST_ID_DESCRIPTION })
  @ApiNotFoundResponse({
    description: COMMON.GOAL_NOT_FOUND_DESCRIPTION,
    schema: { example: COMMON.GOAL_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description: `${COMMON.ALREADY_COMPLETED_DESCRIPTION} ${COMMON.PROGRESS_CHECK_PENDING_DESCRIPTION}`,
    schema: { example: COMMON.ALREADY_COMPLETED_EXAMPLE },
  })
  completeTeacherGoal(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(PARAMS.GOAL_ID, ParseUUIDPipe) goalId: string,
  ): Promise<TeacherGoalIdResponse> {
    return this.teacherGoalsService.completeTeacherGoal({
      goalId,
      teacherId: teacher.id,
    });
  }

  @Delete(API_ROUTES.TEACHERS.MY_GOAL_BY_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: DELETE_TEACHER_GOAL_SWAGGER.SUMMARY,
    description: DELETE_TEACHER_GOAL_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.GOAL_ID,
    type: String,
    format: 'uuid',
    description: COMMON.GOAL_ID_DESCRIPTION,
  })
  @ApiNoContentResponse({
    description: DELETE_TEACHER_GOAL_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: DELETE_TEACHER_GOAL_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: COMMON.GOAL_NOT_FOUND_DESCRIPTION,
    schema: { example: COMMON.GOAL_NOT_FOUND_EXAMPLE },
  })
  deleteTeacherGoal(
    @CurrentUser() teacher: CurrentUserResponse,
    @Param(PARAMS.GOAL_ID, ParseUUIDPipe) goalId: string,
  ): Promise<void> {
    return this.teacherGoalsService.deleteTeacherGoal({
      goalId,
      teacherId: teacher.id,
    });
  }
}
