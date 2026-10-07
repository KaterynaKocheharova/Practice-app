import { Module } from '@nestjs/common';

import { JwtAccessGuard, RolesGuard } from '../../common/auth';
import { JwtTokenModule } from '../../common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { StudentLanguageCoursesController } from './controllers/student-language-courses.controller';
import { StudentsController } from './controllers/students.controller';
import {
  ManagedStudentGuard,
  StudentAccessGuard,
  StudentEditGuard,
} from './guards';
import {
  StudentLanguageCoursesRepository,
  StudentsRepository,
} from './repositories';
import {
  StudentAccessService,
  StudentLanguageCoursesService,
  StudentUpdateService,
  StudentsService,
} from './services';

@Module({
  imports: [DatabaseModule, JwtTokenModule, TeachersModule, UsersModule],
  controllers: [StudentsController, StudentLanguageCoursesController],
  providers: [
    StudentsService,
    StudentAccessService,
    StudentLanguageCoursesService,
    StudentUpdateService,
    StudentsRepository,
    StudentLanguageCoursesRepository,
    JwtAccessGuard,
    RolesGuard,
    ManagedStudentGuard,
    StudentAccessGuard,
    StudentEditGuard,
  ],
})
export class StudentsModule {}
