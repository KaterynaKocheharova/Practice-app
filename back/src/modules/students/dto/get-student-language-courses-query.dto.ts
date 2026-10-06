import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { GET_STUDENT_LANGUAGE_COURSES_SWAGGER } from 'src/constant/swagger/students/get-student-language-courses.swagger';
import { Language } from '../enums';

const { QUERY } = GET_STUDENT_LANGUAGE_COURSES_SWAGGER;

export class GetStudentLanguageCoursesQueryDto {
  @ApiPropertyOptional({
    enum: Language,
    example: QUERY.LANGUAGE.EXAMPLE,
    description: QUERY.LANGUAGE.DESCRIPTION,
  })
  @IsOptional()
  @IsEnum(Language)
  declare language?: Language;
}
