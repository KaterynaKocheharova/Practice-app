import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CREATE_COURSE_FILE_DOCUMENT_SWAGGER } from 'src/constant/swagger/students/create-course-file-document.swagger';
import { studentsConfig } from '../config';

const { VALIDATION } = studentsConfig;
const { BODY } = CREATE_COURSE_FILE_DOCUMENT_SWAGGER;

/** Attaches an uploaded file; without a title, the file name is used. */
export class CreateCourseFileDocumentDto {
  @ApiProperty({
    example: BODY.MEDIA_ASSET_ID.EXAMPLE,
    description: BODY.MEDIA_ASSET_ID.DESCRIPTION,
    format: 'uuid',
  })
  @IsUUID()
  declare mediaAssetId: string;

  @ApiPropertyOptional({
    example: BODY.TITLE.EXAMPLE,
    description: BODY.TITLE.DESCRIPTION,
    minLength: 1,
    maxLength: VALIDATION.DOCUMENT_TITLE_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.DOCUMENT_TITLE_MAX_LENGTH)
  declare title?: string;
}
