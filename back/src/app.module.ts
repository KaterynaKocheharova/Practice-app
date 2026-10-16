import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import {
  AuthModule,
  MailModule,
  MediaAssetsModule,
  OnboardingModule,
  StudentsModule,
  TeachersModule,
  UsersModule,
} from './modules';
import { QueueModule } from './queue';
import { DEFAULT_THROTTLE } from './common/constants/throttle.constant';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { ttl: DEFAULT_THROTTLE.TTL_MS, limit: DEFAULT_THROTTLE.LIMIT },
    ]),
    DatabaseModule,
    QueueModule,
    CommonModule,
    AuthModule,
    MailModule,
    MediaAssetsModule,
    OnboardingModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
