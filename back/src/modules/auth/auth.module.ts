import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { JwtTokenModule } from 'src/common/jwt/jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { MailModule } from '../mail';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthEmailProcessor } from './processors/auth-email.processor';
import { AuthSessionsRepository } from './repositories/auth-sessions.repository';
import { AuthService } from './services/auth.service';
import { AuthTokenService } from './services/auth-token.service';
import { AuthEmailQueueService } from './services/helpers/auth-email-queue.service';
import { AuthVerificationService } from './services/helpers/auth-verification.service';
import { SignupService } from './services/signup.service';
import { VerifySignupService } from './services/verify-signup.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAMES.AUTH_EMAIL }),
    DatabaseModule,
    HashingModule,
    JwtTokenModule,
    MailModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignupService,
    VerifySignupService,
    AuthTokenService,
    AuthSessionsRepository,
    AuthEmailQueueService,
    AuthVerificationService,
    AuthEmailProcessor,
  ],
})
export class AuthModule {}
