import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { KeyValueStoreModule } from 'src/common/key-value-store';
import { JwtTokenModule } from 'src/common/jwt/jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { MailModule } from '../mail';
import { UsersModule } from '../users/users.module';
import { authConfig } from './config';
import { AuthController } from './controllers/auth.controller';
import { JwtRefreshGuard } from './guards';
import {
  AuthMaintenanceProcessor,
  AuthEmailProcessor,
  SigninVerificationEmailProcessor,
  SignupVerificationEmailProcessor,
} from './processors';
import {
  AuthSessionsRepository,
  VerificationLinksRepository,
} from './repositories';
import { AuthService } from './services/auth.service';
import { AuthSessionService } from './services/auth-session.service';
import { AuthTokenService } from './services/auth-token.service';
import { ChangePasswordService } from './services/change-password.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { AuthEmailQueueService } from './services/helpers/auth-email-queue.service';
import { AuthMaintenanceQueueService } from './services/helpers/auth-maintenance-queue.service';
import { AuthVerificationService } from './services/helpers/auth-verification.service';
import { GoogleOAuthStateDecoderService } from './services/helpers/google-oauth-state-decoder.service';
import { GoogleOAuthStateEncoderService } from './services/helpers/google-oauth-state-encoder.service';
import { GoogleOAuthExchangeCodeService } from './services/helpers/google-oauth-exchange-code.service';
import { GoogleOAuthStateService } from './services/helpers/google-oauth-state.service';
import { RefreshGraceService } from './services/helpers/refresh-grace.service';
import { LogoutService } from './services/logout.service';
import { RefreshService } from './services/refresh.service';
import { SigninService } from './services/signin.service';
import { SignupService } from './services/signup.service';
import { VerifySigninService } from './services/verify-signin.service';
import { VerifySignupService } from './services/verify-signup.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: authConfig.QUEUES.EMAIL }),
    BullModule.registerQueue({ name: authConfig.QUEUES.MAINTENANCE }),
    DatabaseModule,
    HashingModule,
    JwtTokenModule,
    KeyValueStoreModule,
    MailModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SigninService,
    SignupService,
    VerifySigninService,
    VerifySignupService,
    RefreshService,
    LogoutService,
    ChangePasswordService,
    GoogleOAuthService,
    AuthSessionService,
    AuthTokenService,
    AuthSessionsRepository,
    VerificationLinksRepository,
    JwtRefreshGuard,
    AuthEmailQueueService,
    AuthMaintenanceQueueService,
    AuthVerificationService,
    GoogleOAuthStateDecoderService,
    GoogleOAuthStateEncoderService,
    GoogleOAuthStateService,
    GoogleOAuthExchangeCodeService,
    RefreshGraceService,
    AuthMaintenanceProcessor,
    AuthEmailProcessor,
    SigninVerificationEmailProcessor,
    SignupVerificationEmailProcessor,
  ],
})
export class AuthModule {}
