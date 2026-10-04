import { Module } from '@nestjs/common';

import { JwtAccessGuard, RolesGuard } from '../../common/auth';
import { JwtTokenModule } from '../../common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { StudentsController } from './controllers/students.controller';
import { ManagedStudentGuard, StudentAccessGuard } from './guards';
import {
  StudentLanguageCoursesRepository,
  StudentsRepository,
} from './repositories';
import {
  StudentAccessService,
  StudentLanguageCoursesService,
  StudentsService,
} from './services';

@Module({
  imports: [DatabaseModule, JwtTokenModule, TeachersModule, UsersModule],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    StudentAccessService,
    StudentLanguageCoursesService,
    StudentsRepository,
    StudentLanguageCoursesRepository,
    JwtAccessGuard,
    RolesGuard,
    ManagedStudentGuard,
    StudentAccessGuard,
  ],
})
export class StudentsModule {}
