import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/create-student-language-course.swagger';
import { UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER } from 'src/constant/swagger/students/update-student-language-course.swagger';
import { studentsConfig } from '../config';
import { LanguageLevel, LearningGoal } from '../enums';

const { VALIDATION } = studentsConfig;
const { BODY } = CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER;
const { NULLABLE_FIELD_DESCRIPTION } = UPDATE_STUDENT_LANGUAGE_COURSE_SWAGGER;

const LEVEL_PROPERTY = {
  enum: LanguageLevel,
  example: BODY.LEVEL.EXAMPLE,
  description: `${BODY.LEVEL.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
  nullable: true,
} as const;

export class UpdateStudentLanguageCourseDto {
  @ApiPropertyOptional({
    enum: LearningGoal,
    example: BODY.LEARNING_GOAL.EXAMPLE,
    description: `${BODY.LEARNING_GOAL.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(LearningGoal)
  declare learningGoal?: LearningGoal | null;

  @ApiPropertyOptional({
    example: BODY.SPECIAL_GOAL.EXAMPLE,
    description: `${BODY.SPECIAL_GOAL.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    maxLength: VALIDATION.SPECIAL_GOAL_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.SPECIAL_GOAL_MAX_LENGTH)
  declare specialGoal?: string | null;

  @ApiPropertyOptional({
    example: BODY.COMMENTS.EXAMPLE,
    description: `${BODY.COMMENTS.DESCRIPTION} ${NULLABLE_FIELD_DESCRIPTION}`,
    maxLength: VALIDATION.COMMENTS_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.COMMENTS_MAX_LENGTH)
  declare comments?: string | null;

  @ApiPropertyOptional(LEVEL_PROPERTY)
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare grammarLevel?: LanguageLevel | null;

  @ApiPropertyOptional(LEVEL_PROPERTY)
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare vocabularyLevel?: LanguageLevel | null;

  @ApiPropertyOptional(LEVEL_PROPERTY)
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare speakingLevel?: LanguageLevel | null;

  @ApiPropertyOptional(LEVEL_PROPERTY)
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare readingLevel?: LanguageLevel | null;

  @ApiPropertyOptional(LEVEL_PROPERTY)
  @IsOptional()
  @IsEnum(LanguageLevel)
  declare listeningLevel?: LanguageLevel | null;
}
