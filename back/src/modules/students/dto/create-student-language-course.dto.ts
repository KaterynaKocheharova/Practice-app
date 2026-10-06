import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/create-student-language-course.swagger';
import { studentsConfig } from '../config';
import { Language, LanguageLevel } from '../enums';

const { VALIDATION } = studentsConfig;
const { BODY } = CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER;

export class CreateStudentLanguageCourseDto {
  @ApiProperty({
    enum: Language,
    example: BODY.LANGUAGE.EXAMPLE,
    description: BODY.LANGUAGE.DESCRIPTION,
  })
  @IsEnum(Language)
  declare language: Language;

  @ApiPropertyOptional({
    example: BODY.LEARNING_GOAL.EXAMPLE,
    description: BODY.LEARNING_GOAL.DESCRIPTION,
    maxLength: VALIDATION.LEARNING_GOAL_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.LEARNING_GOAL_MAX_LENGTH)
  declare learningGoal?: string;

  @ApiPropertyOptional({
    example: BODY.SPECIAL_GOAL.EXAMPLE,
    description: BODY.SPECIAL_GOAL.DESCRIPTION,
    maxLength: VALIDATION.SPECIAL_GOAL_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.SPECIAL_GOAL_MAX_LENGTH)
  declare specialGoal?: string;

  @ApiPropertyOptional({
    example: BODY.COMMENTS.EXAMPLE,
    description: BODY.COMMENTS.DESCRIPTION,
    maxLength: VALIDATION.COMMENTS_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.COMMENTS_MAX_LENGTH)
  declare comments?: string;

  @ApiPropertyOptional({
    enum: LanguageLevel,
    example: BODY.LEVEL.EXAMPLE,
    description: BODY.LEVEL.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare grammarLevel?: LanguageLevel;

  @ApiPropertyOptional({
    enum: LanguageLevel,
    example: BODY.LEVEL.EXAMPLE,
    description: BODY.LEVEL.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare vocabularyLevel?: LanguageLevel;

  @ApiPropertyOptional({
    enum: LanguageLevel,
    example: BODY.LEVEL.EXAMPLE,
    description: BODY.LEVEL.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare speakingLevel?: LanguageLevel;

  @ApiPropertyOptional({
    enum: LanguageLevel,
    example: BODY.LEVEL.EXAMPLE,
    description: BODY.LEVEL.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare readingLevel?: LanguageLevel;

  @ApiPropertyOptional({
    enum: LanguageLevel,
    example: BODY.LEVEL.EXAMPLE,
    description: BODY.LEVEL.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare listeningLevel?: LanguageLevel;
}
