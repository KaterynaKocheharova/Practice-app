import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtOnboardingAccessGuard } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { COMPLETE_ONBOARDING_SWAGGER } from 'src/constant/swagger/onboarding/complete-onboarding.swagger';
import { ONBOARDING_SWAGGER } from 'src/constant/swagger/onboarding/onboarding.swagger';
import type { CurrentUserResponse } from 'src/modules/users/types';
import { CompleteOnboardingDto } from '../dto/complete-onboarding.dto';
import { OnboardingService } from '../services/onboarding.service';

@ApiTags(ONBOARDING_SWAGGER.TAG)
@Controller(API_ROUTES.ONBOARDING.ROOT)
@UseGuards(JwtOnboardingAccessGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: COMPLETE_ONBOARDING_SWAGGER.SUMMARY,
    description: COMPLETE_ONBOARDING_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(COMPLETE_ONBOARDING_SWAGGER.COOKIE_AUTH_NAME)
  @ApiBody({
    type: CompleteOnboardingDto,
    description: COMPLETE_ONBOARDING_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiNoContentResponse({
    description: COMPLETE_ONBOARDING_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: COMPLETE_ONBOARDING_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: COMPLETE_ONBOARDING_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: COMPLETE_ONBOARDING_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiConflictResponse({
    description: COMPLETE_ONBOARDING_SWAGGER.CONFLICT_RESPONSE_DESCRIPTION,
    schema: { example: COMPLETE_ONBOARDING_SWAGGER.CONFLICT_RESPONSE_EXAMPLE },
  })
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
