import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { students } from '../../students/schemas/schema';
import { teachers } from '../../teachers/schemas/schema';
import { UserRole, UserStatus } from '../../users/enums';
import { users } from '../../users/schemas/schema';
import type { DatabaseTransaction } from '../../users/types';
import type {
  CompleteOnboardingData,
  CompleteStudentOnboardingData,
} from '../types/onboarding.type';

@Injectable()
export class OnboardingRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async completeStudentOnboarding({
    student,
    ...user
  }: CompleteStudentOnboardingData): Promise<boolean> {
    return this.database.transaction(async (transaction) => {
      const isActivated = await this.activateOnboardingUser(
        transaction,
        user,
        UserRole.Student,
      );

      if (isActivated) {
        await transaction
          .insert(students)
          .values({ ...student, userId: user.userId });
      }

      return isActivated;
    });
  }

  @HandleDatabaseError()
  async completeTeacherOnboarding(
    user: CompleteOnboardingData,
  ): Promise<boolean> {
    return this.database.transaction(async (transaction) => {
      const isActivated = await this.activateOnboardingUser(
        transaction,
        user,
        UserRole.Teacher,
      );

      if (isActivated) {
        await transaction.insert(teachers).values({ userId: user.userId });
      }

      return isActivated;
    });
  }

  private async activateOnboardingUser(
    transaction: DatabaseTransaction,
    { userId, name }: CompleteOnboardingData,
    role: UserRole,
  ): Promise<boolean> {
    const [user] = await transaction
      .update(users)
      .set({ name, role, status: UserStatus.Active })
      .where(and(eq(users.id, userId), eq(users.status, UserStatus.Onboarding)))
      .returning({ id: users.id });

    return !!user;
  }
}
