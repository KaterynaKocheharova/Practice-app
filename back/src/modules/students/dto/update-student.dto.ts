import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { CREATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/create-student.swagger';
import { UPDATE_STUDENT_SWAGGER } from 'src/constant/swagger/students/update-student.swagger';
import { studentsConfig } from '../config';

const { VALIDATION } = studentsConfig;
const { BODY } = CREATE_STUDENT_SWAGGER;
const { NULLABLE_FIELD_DESCRIPTION } = UPDATE_STUDENT_SWAGGER;

export class UpdateStudentDto {
  @ApiPropertyOptional({
    example: BODY.NAME.EXAMPLE,
    description: BODY.NAME.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.NAME_MAX_LENGTH,
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare name?: string;

  @ApiPropertyOptional({
    example: BODY.EMAIL.EXAMPLE,
    description: `${BODY.EMAIL.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    maxLength: VALIDATION.EMAIL_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(VALIDATION.EMAIL_MAX_LENGTH)
  declare email?: string | null;

  @ApiPropertyOptional({
    example: BODY.BIRTH_DATE.EXAMPLE,
    description: `${BODY.BIRTH_DATE.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  declare birthDate?: string | null;

  @ApiPropertyOptional({
    example: BODY.JOB.EXAMPLE,
    description: `${BODY.JOB.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    maxLength: VALIDATION.JOB_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.JOB_MAX_LENGTH)
  declare job?: string | null;

  @ApiPropertyOptional({
    example: BODY.HOBBIES.EXAMPLE,
    description: `${BODY.HOBBIES.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    type: [String],
    maxItems: VALIDATION.HOBBIES_MAX_COUNT,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(VALIDATION.HOBBIES_MAX_COUNT)
  @IsString({ each: true })
  @MaxLength(VALIDATION.HOBBY_MAX_LENGTH, { each: true })
  declare hobbies?: string[] | null;
}
