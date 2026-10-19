import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { TeacherGoalsController } from './controllers/teacher-goals.controller';
import { TeacherGoalsRepository, TeachersRepository } from './repositories';
import { TeacherGoalsService, TeachersService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [TeacherGoalsController],
  providers: [
    TeachersService,
    TeachersRepository,
    TeacherGoalsService,
    TeacherGoalsRepository,
  ],
  exports: [TeachersService],
})
export class TeachersModule {}
