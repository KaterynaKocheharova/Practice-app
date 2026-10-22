import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { GET_TEACHER_GOALS_SWAGGER } from 'src/constant/swagger/teachers/get-teacher-goals.swagger';
import { teachersConfig } from '../config';
import { TeacherGoalStatus } from '../enums';

const { PAGINATION } = teachersConfig;
const { QUERY } = GET_TEACHER_GOALS_SWAGGER;

export class GetTeacherGoalsQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: QUERY.LIMIT.EXAMPLE,
    description: QUERY.LIMIT.DESCRIPTION,
    minimum: 1,
    maximum: PAGINATION.MAX_LIMIT,
    default: PAGINATION.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  limit: number = PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    type: Number,
    example: QUERY.OFFSET.EXAMPLE,
    description: QUERY.OFFSET.DESCRIPTION,
    minimum: 0,
    default: PAGINATION.DEFAULT_OFFSET,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = PAGINATION.DEFAULT_OFFSET;

  @ApiPropertyOptional({
    enum: TeacherGoalStatus,
    example: QUERY.STATUS.EXAMPLE,
    description: QUERY.STATUS.DESCRIPTION,
    default: TeacherGoalStatus.Active,
  })
  @IsOptional()
  @IsEnum(TeacherGoalStatus)
  status: TeacherGoalStatus = TeacherGoalStatus.Active;
}
