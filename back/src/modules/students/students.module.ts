import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { JwtAccessGuard, RolesGuard } from '../../common/auth';
import { JwtTokenModule } from '../../common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { MediaAssetsModule } from '../media-assets';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { studentsConfig } from './config';
import { CourseDocumentsController } from './controllers/course-documents.controller';
import { StudentLanguageCoursesController } from './controllers/student-language-courses.controller';
import { StudentsController } from './controllers/students.controller';
import {
  CourseDocumentDeleteGuard,
  ManagedStudentGuard,
  StudentAccessGuard,
  StudentEditGuard,
  StudentLanguageCourseAccessGuard,
} from './guards';
import { CourseDocumentsProcessor } from './processors/course-documents.processor';
import {
  CourseDocumentsRepository,
  StudentLanguageCoursesRepository,
  StudentsRepository,
} from './repositories';
import {
  CourseDocumentAccessService,
  CourseDocumentDeletionService,
  CourseDocumentsQueueService,
  CourseDocumentsService,
  CourseDocumentUploadService,
  StudentAccessService,
  StudentLanguageCourseAccessService,
  StudentLanguageCoursesService,
  StudentUpdateService,
  StudentsService,
} from './services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: studentsConfig.COURSE_DOCUMENTS.QUEUE.NAME,
    }),
    DatabaseModule,
    JwtTokenModule,
    MediaAssetsModule,
    TeachersModule,
    UsersModule,
  ],
  controllers: [
    StudentsController,
    StudentLanguageCoursesController,
    CourseDocumentsController,
  ],
  providers: [
    StudentsService,
    StudentAccessService,
    StudentLanguageCoursesService,
    StudentLanguageCourseAccessService,
    StudentUpdateService,
    CourseDocumentsService,
    CourseDocumentUploadService,
    CourseDocumentAccessService,
    CourseDocumentDeletionService,
    CourseDocumentsQueueService,
    CourseDocumentsProcessor,
    StudentsRepository,
    StudentLanguageCoursesRepository,
    CourseDocumentsRepository,
    JwtAccessGuard,
    RolesGuard,
    ManagedStudentGuard,
    StudentAccessGuard,
    StudentEditGuard,
    StudentLanguageCourseAccessGuard,
    CourseDocumentDeleteGuard,
  ],
})
export class StudentsModule {}
