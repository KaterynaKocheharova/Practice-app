import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './services/users/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CommonModule,
    UsersModule,
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
