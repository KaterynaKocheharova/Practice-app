import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtOnboardingAccessGuard } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import type { CurrentUserResponse } from 'src/modules/users/types';
import { CompleteOnboardingDto } from '../dto/complete-onboarding.dto';
import { OnboardingService } from '../services/onboarding.service';

@Controller(API_ROUTES.ONBOARDING.ROOT)
@UseGuards(JwtOnboardingAccessGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  completeOnboarding(
    @CurrentUser() user: CurrentUserResponse,
    @Body() completeOnboardingDto: CompleteOnboardingDto,
  ): Promise<void> {
    return this.onboardingService.completeOnboarding(
      user.id,
      completeOnboardingDto,
    );
  }
}
