import { Module } from '@nestjs/common';

import { JwtAccessGuard, RolesGuard } from '../../common/auth';
import { JwtTokenModule } from '../../common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../users/users.module';
import { TeacherGoalsController } from './controllers/teacher-goals.controller';
import { TeacherGoalsRepository, TeachersRepository } from './repositories';
import { TeacherGoalsService, TeachersService } from './services';

@Module({
  imports: [DatabaseModule, JwtTokenModule, UsersModule],
  controllers: [TeacherGoalsController],
  providers: [
    TeachersService,
    TeachersRepository,
    TeacherGoalsService,
    TeacherGoalsRepository,
    JwtAccessGuard,
    RolesGuard,
  ],
  exports: [TeachersService],
})
export class TeachersModule {}
