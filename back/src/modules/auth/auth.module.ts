import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HashingModule } from 'src/common/hashing';
import { JwtTokenModule } from 'src/common/jwt';
import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { MailModule } from '../mail';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers';
import { AuthEmailProcessor } from './processors';
import {
  AuthEmailQueueService,
  AuthService,
  AuthVerificationService,
  SignupService,
} from './services';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAMES.AUTH_EMAIL }),
    HashingModule,
    JwtTokenModule,
    MailModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignupService,
    AuthEmailQueueService,
    AuthVerificationService,
    AuthEmailProcessor,
  ],
})
export class AuthModule {}
