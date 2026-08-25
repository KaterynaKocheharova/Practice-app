import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TeachersRepository } from './repositories';
import { TeachersService } from './services';

@Module({
  imports: [DatabaseModule],
  providers: [TeachersService, TeachersRepository],
  exports: [TeachersRepository],
})
export class TeachersModule {}
