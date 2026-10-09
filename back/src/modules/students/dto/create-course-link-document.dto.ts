import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { CREATE_COURSE_LINK_DOCUMENT_SWAGGER } from 'src/constant/swagger/students/create-course-link-document.swagger';
import { studentsConfig } from '../config';

const { VALIDATION } = studentsConfig;
const { BODY } = CREATE_COURSE_LINK_DOCUMENT_SWAGGER;

/** An external link (e.g. Google Sheets); stored as-is, never fetched. */
export class CreateCourseLinkDocumentDto {
  @ApiProperty({
    example: BODY.URL.EXAMPLE,
    description: BODY.URL.DESCRIPTION,
    format: 'uri',
    maxLength: VALIDATION.DOCUMENT_URL_MAX_LENGTH,
  })
  @IsUrl({
    protocols: [...VALIDATION.DOCUMENT_URL_PROTOCOLS],
    require_protocol: true,
  })
  @MaxLength(VALIDATION.DOCUMENT_URL_MAX_LENGTH)
  declare url: string;

  @ApiProperty({
    example: BODY.TITLE.EXAMPLE,
    description: BODY.TITLE.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.DOCUMENT_TITLE_MAX_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.DOCUMENT_TITLE_MAX_LENGTH)
  declare title: string;
}
