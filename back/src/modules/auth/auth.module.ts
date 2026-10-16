import { Module } from '@nestjs/common';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { KeyValueStoreModule } from 'src/common/key-value-store';
import { JwtTokenModule } from 'src/common/jwt/jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { JwtRefreshGuard } from './guards';
import { AuthSessionsRepository } from './repositories';
import { AuthService } from './services/auth.service';
import { AuthSessionService } from './services/auth-session.service';
import { AuthTokenService } from './services/auth-token.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { GoogleOAuthExchangeCodeService } from './services/helpers/google-oauth-exchange-code.service';
import { RefreshGraceService } from './services/helpers/refresh-grace.service';
import { LogoutService } from './services/logout.service';
import { RefreshService } from './services/refresh.service';

@Module({
  imports: [
    DatabaseModule,
    HashingModule,
    JwtTokenModule,
    KeyValueStoreModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshService,
    LogoutService,
    GoogleOAuthService,
    AuthSessionService,
    AuthTokenService,
    AuthSessionsRepository,
    JwtRefreshGuard,
    GoogleOAuthExchangeCodeService,
    RefreshGraceService,
  ],
})
export class AuthModule {}
