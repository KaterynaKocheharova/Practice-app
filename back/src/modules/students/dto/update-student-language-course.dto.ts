import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { studentsConfig } from '../config';
import { LanguageLevel, LearningGoal } from '../enums';

const { VALIDATION } = studentsConfig;

export class UpdateStudentLanguageCourseDto {
  @IsOptional()
  @IsEnum(LearningGoal)
  declare learningGoal?: LearningGoal | null;

  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.SPECIAL_GOAL_MAX_LENGTH)
  declare specialGoal?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.COMMENTS_MAX_LENGTH)
  declare comments?: string | null;

  @IsOptional()
  @IsEnum(LanguageLevel)
  declare grammarLevel?: LanguageLevel | null;

  @IsOptional()
  @IsEnum(LanguageLevel)
  declare vocabularyLevel?: LanguageLevel | null;

  @IsOptional()
  @IsEnum(LanguageLevel)
  declare speakingLevel?: LanguageLevel | null;

  @IsOptional()
  @IsEnum(LanguageLevel)
  declare readingLevel?: LanguageLevel | null;

  @IsOptional()
  @IsEnum(LanguageLevel)
  declare listeningLevel?: LanguageLevel | null;
}
