import { Module } from '@nestjs/common';
import { JwtAccessGuard } from 'src/common/auth';
import { JwtTokenModule } from 'src/common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories';
import { UsersService } from './services/users.service';

@Module({
  imports: [DatabaseModule, JwtTokenModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtAccessGuard],
  exports: [UsersService],
})
export class UsersModule {}
