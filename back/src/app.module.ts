import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import {
  MailModule,
  StudentsModule,
  TeachersModule,
  UsersModule,
} from './modules';
import { QueueModule } from './queue';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    QueueModule,
    CommonModule,
    MailModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
