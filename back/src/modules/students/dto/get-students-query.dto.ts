import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { GET_STUDENTS_SWAGGER } from 'src/constant/swagger/students/get-students.swagger';
import { studentsConfig } from '../config';

const { PAGINATION, VALIDATION } = studentsConfig;
const { QUERY } = GET_STUDENTS_SWAGGER;

export class GetStudentsQueryDto {
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

  /** Matches students whose name or email starts with it. */
  @ApiPropertyOptional({
    example: QUERY.SEARCH.EXAMPLE,
    description: QUERY.SEARCH.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.NAME_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare search?: string;
}
