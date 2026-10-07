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
import { studentsConfig } from '../config';

const { VALIDATION } = studentsConfig;

export class UpdateStudentDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(VALIDATION.EMAIL_MAX_LENGTH)
  declare email?: string | null;

  @IsOptional()
  @IsISO8601({ strict: true })
  declare birthDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.JOB_MAX_LENGTH)
  declare job?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(VALIDATION.HOBBIES_MAX_COUNT)
  @IsString({ each: true })
  @MaxLength(VALIDATION.HOBBY_MAX_LENGTH, { each: true })
  declare hobbies?: string[] | null;
}
