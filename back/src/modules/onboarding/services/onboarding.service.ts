import { ConflictException, Injectable } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserRole } from 'src/modules/users/enums';
import type { CompleteOnboardingDto } from '../dto/complete-onboarding.dto';
import { OnboardingRepository } from '../repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  async completeOnboarding(
    userId: string,
    { name, role, student }: CompleteOnboardingDto,
  ): Promise<void> {
    const isCompleted =
      role === UserRole.Student
        ? await this.onboardingRepository.completeStudentOnboarding({
            userId,
            name,
            student: {
              birthDate: student?.birthDate,
              job: student?.job,
              hobbies: student?.hobbies,
            },
          })
        : await this.onboardingRepository.completeTeacherOnboarding({
            userId,
            name,
          });

    if (!isCompleted) {
      throw new ConflictException({
        errorCode: ERROR_CODE.ONBOARDING_ALREADY_COMPLETED,
      });
    }
  }
}
