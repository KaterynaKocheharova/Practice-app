import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { TEACHER_GOALS_SWAGGER } from 'src/constant/swagger/teachers/teacher-goals.swagger';
import { UPDATE_TEACHER_GOAL_SWAGGER } from 'src/constant/swagger/teachers/update-teacher-goal.swagger';
import { teachersConfig } from '../config';

const { VALIDATION } = teachersConfig;
const { BODY } = TEACHER_GOALS_SWAGGER;
const { NULLABLE_FIELD_DESCRIPTION } = UPDATE_TEACHER_GOAL_SWAGGER;

export class UpdateTeacherGoalDto {
  @ApiPropertyOptional({
    example: BODY.TITLE.EXAMPLE,
    description: BODY.TITLE.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.GOAL_TITLE_MAX_LENGTH,
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(VALIDATION.GOAL_TITLE_MAX_LENGTH)
  declare title?: string;

  @ApiPropertyOptional({
    example: BODY.DETAILS.EXAMPLE,
    description: `${BODY.DETAILS.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    maxLength: VALIDATION.GOAL_DETAILS_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.GOAL_DETAILS_MAX_LENGTH)
  declare details?: string | null;
}
