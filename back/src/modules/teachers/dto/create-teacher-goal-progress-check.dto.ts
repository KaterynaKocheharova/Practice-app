import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER } from 'src/constant/swagger/teachers/create-teacher-goal-progress-check.swagger';
import { GoalProgressStatus } from '../enums';

const { BODY } = CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER;

export class CreateTeacherGoalProgressCheckDto {
  @ApiProperty({
    enum: GoalProgressStatus,
    example: BODY.STATUS.EXAMPLE,
    description: BODY.STATUS.DESCRIPTION,
  })
  @IsEnum(GoalProgressStatus)
  declare status: GoalProgressStatus;
}
