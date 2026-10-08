import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/create-student-language-course.swagger';
import { studentsConfig } from '../config';
import { Language, LanguageLevel, LearningGoal } from '../enums';

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

  @ApiProperty({
    enum: LearningGoal,
    isArray: true,
    minItems: 1,
    uniqueItems: true,
    example: BODY.LEARNING_GOALS.EXAMPLE,
    description: BODY.LEARNING_GOALS.DESCRIPTION,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(LearningGoal, { each: true })
  declare learningGoals: LearningGoal[];

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
