import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CREATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/create-student.swagger';
import { studentsConfig } from '../config';

const { VALIDATION } = studentsConfig;

export class CreateStudentDto {
  @ApiProperty({
    example: CREATE_STUDENT_SWAGGER.BODY.NAME.EXAMPLE,
    description: CREATE_STUDENT_SWAGGER.BODY.NAME.DESCRIPTION,
    maxLength: VALIDATION.NAME_MAX_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare name: string;

  @ApiPropertyOptional({
    example: CREATE_STUDENT_SWAGGER.BODY.BIRTH_DATE.EXAMPLE,
    description: CREATE_STUDENT_SWAGGER.BODY.BIRTH_DATE.DESCRIPTION,
    format: 'date',
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  declare birthDate?: string;

  @ApiPropertyOptional({
    example: CREATE_STUDENT_SWAGGER.BODY.JOB.EXAMPLE,
    description: CREATE_STUDENT_SWAGGER.BODY.JOB.DESCRIPTION,
    maxLength: VALIDATION.JOB_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.JOB_MAX_LENGTH)
  declare job?: string;

  @ApiPropertyOptional({
    example: CREATE_STUDENT_SWAGGER.BODY.HOBBIES.EXAMPLE,
    description: CREATE_STUDENT_SWAGGER.BODY.HOBBIES.DESCRIPTION,
    type: [String],
    maxItems: VALIDATION.HOBBIES_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(VALIDATION.HOBBIES_MAX_COUNT)
  @IsString({ each: true })
  @MaxLength(VALIDATION.HOBBY_MAX_LENGTH, { each: true })
  declare hobbies?: string[];
}
