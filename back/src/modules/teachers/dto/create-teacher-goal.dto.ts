import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TEACHER_GOALS_SWAGGER } from 'src/constant/swagger/teachers/teacher-goals.swagger';
import { teachersConfig } from '../config';

const { VALIDATION } = teachersConfig;
const { BODY } = TEACHER_GOALS_SWAGGER;

export class CreateTeacherGoalDto {
  @ApiProperty({
    example: BODY.TITLE.EXAMPLE,
    description: BODY.TITLE.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.GOAL_TITLE_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(VALIDATION.GOAL_TITLE_MAX_LENGTH)
  declare title: string;

  @ApiPropertyOptional({
    example: BODY.DETAILS.EXAMPLE,
    description: BODY.DETAILS.DESCRIPTION,
    maxLength: VALIDATION.GOAL_DETAILS_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.GOAL_DETAILS_MAX_LENGTH)
  declare details?: string;
}
