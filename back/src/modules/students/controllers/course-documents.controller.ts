import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAccessGuard,
  Roles,
  RolesGuard,
} from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { COURSE_DOCUMENTS_SWAGGER } from 'src/constant/swagger/students/course-documents.swagger';
import { CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER } from 'src/constant/swagger/students/create-course-document-upload-url.swagger';
import { CREATE_COURSE_FILE_DOCUMENT_SWAGGER } from 'src/constant/swagger/students/create-course-file-document.swagger';
import { CREATE_COURSE_LINK_DOCUMENT_SWAGGER } from 'src/constant/swagger/students/create-course-link-document.swagger';
import { DELETE_COURSE_DOCUMENT_SWAGGER } from 'src/constant/swagger/students/delete-course-document.swagger';
import { GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER } from 'src/constant/swagger/students/get-course-document-download-url.swagger';
import { STUDENTS_SWAGGER } from 'src/constant/swagger/students/students.swagger';
import {
  CreateMediaAssetUploadUrlDto,
  type MediaAssetUploadResponse,
} from '../../media-assets';
import { UserRole } from '../../users/enums';
import type { CurrentUserResponse } from '../../users/types';
import {
  CreateCourseFileDocumentDto,
  CreateCourseLinkDocumentDto,
} from '../dto';
import {
  CourseDocumentDeletionService,
  CourseDocumentsService,
  CourseDocumentUploadService,
} from '../services';
import type {
  CourseDocumentDownloadUrlResponse,
  CreatedCourseDocumentResponse,
} from '../types';

const { PARAMS } = API_ROUTES.STUDENTS;
const COMMON = COURSE_DOCUMENTS_SWAGGER;

/**
 * Files and links of one course, under
 * `students/:studentId/courses/:courseId/documents`. The course's student and
 * the teacher running it can add, list (via course details) and download;
 * only the user who added a document can delete it. The documents list is
 * part of the course details response.
 */
@ApiTags(STUDENTS_SWAGGER.TAG)
@ApiCookieAuth(COMMON.COOKIE_AUTH_NAME)
@ApiParam({
  name: PARAMS.STUDENT_ID,
  type: String,
  format: 'uuid',
  description: COMMON.STUDENT_ID_DESCRIPTION,
})
@ApiParam({
  name: PARAMS.COURSE_ID,
  type: String,
  format: 'uuid',
  description: COMMON.COURSE_ID_DESCRIPTION,
})
@ApiUnauthorizedResponse({
  description: COMMON.UNAUTHORIZED_RESPONSE_DESCRIPTION,
  schema: { example: COMMON.UNAUTHORIZED_RESPONSE_EXAMPLE },
})
@Controller(API_ROUTES.STUDENTS.ROOT)
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Teacher, UserRole.Student)
export class CourseDocumentsController {
  constructor(
    private readonly courseDocumentsService: CourseDocumentsService,
    private readonly courseDocumentUploadService: CourseDocumentUploadService,
    private readonly courseDocumentDeletionService: CourseDocumentDeletionService,
  ) {}

  /** Step 1 of a file upload: the client then PUTs the file to `uploadUrl`. */
  @Post(API_ROUTES.STUDENTS.COURSE_DOCUMENT_UPLOAD_URL)
  @ApiOperation({
    summary: CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.SUMMARY,
    description: CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: CreateMediaAssetUploadUrlDto,
    description:
      CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: {
      example:
        CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.CREATED_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.COURSE_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description: COMMON.LIMIT_REACHED_DESCRIPTION,
    schema: { example: COMMON.LIMIT_REACHED_EXAMPLE },
  })
  requestFileUpload(
    @CurrentUser() user: CurrentUserResponse,
    @Param(PARAMS.STUDENT_ID, ParseUUIDPipe) studentId: string,
    @Param(PARAMS.COURSE_ID, ParseUUIDPipe) courseId: string,
    @Body() uploadUrlDto: CreateMediaAssetUploadUrlDto,
  ): Promise<MediaAssetUploadResponse> {
    return this.courseDocumentUploadService.requestFileUpload(
      { courseId, studentId, userId: user.id },
      uploadUrlDto,
    );
  }

  /** Step 2 of a file upload: attaches the uploaded file to the course. */
  @Post(API_ROUTES.STUDENTS.COURSE_DOCUMENT_FILES)
  @ApiOperation({
    summary: CREATE_COURSE_FILE_DOCUMENT_SWAGGER.SUMMARY,
    description: CREATE_COURSE_FILE_DOCUMENT_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: CreateCourseFileDocumentDto,
    description: CREATE_COURSE_FILE_DOCUMENT_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      CREATE_COURSE_FILE_DOCUMENT_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.CREATED_DOCUMENT_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description:
      CREATE_COURSE_FILE_DOCUMENT_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: CREATE_COURSE_FILE_DOCUMENT_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @ApiNotFoundResponse({
    description:
      CREATE_COURSE_FILE_DOCUMENT_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: {
      example: CREATE_COURSE_FILE_DOCUMENT_SWAGGER.NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  @ApiConflictResponse({
    description: COMMON.LIMIT_REACHED_DESCRIPTION,
    schema: { example: COMMON.LIMIT_REACHED_EXAMPLE },
  })
  createFileDocument(
    @CurrentUser() user: CurrentUserResponse,
    @Param(PARAMS.STUDENT_ID, ParseUUIDPipe) studentId: string,
    @Param(PARAMS.COURSE_ID, ParseUUIDPipe) courseId: string,
    @Body() fileDocumentDto: CreateCourseFileDocumentDto,
  ): Promise<CreatedCourseDocumentResponse> {
    return this.courseDocumentUploadService.createFileDocument(
      { courseId, studentId, userId: user.id },
      fileDocumentDto,
    );
  }

  @Post(API_ROUTES.STUDENTS.COURSE_DOCUMENT_LINKS)
  @ApiOperation({
    summary: CREATE_COURSE_LINK_DOCUMENT_SWAGGER.SUMMARY,
    description: CREATE_COURSE_LINK_DOCUMENT_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: CreateCourseLinkDocumentDto,
    description: CREATE_COURSE_LINK_DOCUMENT_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      CREATE_COURSE_LINK_DOCUMENT_SWAGGER.CREATED_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.CREATED_DOCUMENT_EXAMPLE },
  })
  @ApiBadRequestResponse({
    description:
      CREATE_COURSE_LINK_DOCUMENT_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      CREATE_COURSE_LINK_DOCUMENT_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.COURSE_NOT_FOUND_EXAMPLE },
  })
  @ApiConflictResponse({
    description: COMMON.LIMIT_REACHED_DESCRIPTION,
    schema: { example: COMMON.LIMIT_REACHED_EXAMPLE },
  })
  createLinkDocument(
    @CurrentUser() user: CurrentUserResponse,
    @Param(PARAMS.STUDENT_ID, ParseUUIDPipe) studentId: string,
    @Param(PARAMS.COURSE_ID, ParseUUIDPipe) courseId: string,
    @Body() linkDocumentDto: CreateCourseLinkDocumentDto,
  ): Promise<CreatedCourseDocumentResponse> {
    return this.courseDocumentsService.createLinkDocument(
      { courseId, studentId, userId: user.id },
      linkDocumentDto,
    );
  }

  @Get(API_ROUTES.STUDENTS.COURSE_DOCUMENT_DOWNLOAD_URL)
  @ApiOperation({
    summary: GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.SUMMARY,
    description: GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.DOCUMENT_ID,
    type: String,
    format: 'uuid',
    description: COMMON.DOCUMENT_ID_DESCRIPTION,
  })
  @ApiOkResponse({
    description:
      GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description:
      GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description:
      GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.DOCUMENT_NOT_FOUND_EXAMPLE },
  })
  createDownloadUrl(
    @CurrentUser() user: CurrentUserResponse,
    @Param(PARAMS.STUDENT_ID, ParseUUIDPipe) studentId: string,
    @Param(PARAMS.COURSE_ID, ParseUUIDPipe) courseId: string,
    @Param(PARAMS.DOCUMENT_ID, ParseUUIDPipe) documentId: string,
  ): Promise<CourseDocumentDownloadUrlResponse> {
    return this.courseDocumentsService.createDownloadUrl({
      courseId,
      studentId,
      documentId,
      userId: user.id,
    });
  }

  @Delete(API_ROUTES.STUDENTS.COURSE_DOCUMENT_BY_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: DELETE_COURSE_DOCUMENT_SWAGGER.SUMMARY,
    description: DELETE_COURSE_DOCUMENT_SWAGGER.DESCRIPTION,
  })
  @ApiParam({
    name: PARAMS.DOCUMENT_ID,
    type: String,
    format: 'uuid',
    description: COMMON.DOCUMENT_ID_DESCRIPTION,
  })
  @ApiNoContentResponse({
    description: DELETE_COURSE_DOCUMENT_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description:
      DELETE_COURSE_DOCUMENT_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: DELETE_COURSE_DOCUMENT_SWAGGER.NOT_FOUND_RESPONSE_DESCRIPTION,
    schema: { example: COMMON.DOCUMENT_NOT_FOUND_EXAMPLE },
  })
  deleteCourseDocument(
    @CurrentUser() user: CurrentUserResponse,
    @Param(PARAMS.STUDENT_ID, ParseUUIDPipe) studentId: string,
    @Param(PARAMS.COURSE_ID, ParseUUIDPipe) courseId: string,
    @Param(PARAMS.DOCUMENT_ID, ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    return this.courseDocumentDeletionService.deleteCourseDocument({
      courseId,
      studentId,
      documentId,
      userId: user.id,
    });
  }
}
