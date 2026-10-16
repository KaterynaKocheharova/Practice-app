import { Module } from '@nestjs/common';

import { JwtOnboardingAccessGuard } from '../../common/auth';
import { JwtTokenModule } from '../../common/jwt';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../users/users.module';
import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { OnboardingService } from './services/onboarding.service';

@Module({
  imports: [DatabaseModule, JwtTokenModule, UsersModule],
  controllers: [OnboardingController],
  providers: [
    OnboardingService,
    OnboardingRepository,
    JwtOnboardingAccessGuard,
  ],
})
export class OnboardingModule {}
