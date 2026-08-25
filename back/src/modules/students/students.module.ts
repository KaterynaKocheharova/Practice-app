import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { TeachersModule } from '../teachers/teachers.module';
import { StudentsRepository } from './repositories';
import { StudentsService } from './services';

@Module({
  imports: [DatabaseModule, TeachersModule],
  providers: [StudentsService, StudentsRepository],
})
export class StudentsModule {}
