import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull, lte } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from 'src/database/config/config';
import { HandleDatabaseError } from 'src/database/decorators';
import { verificationLinkVerificationSelectFields } from '../constants/repository';
import { SignupVerificationTokenPurpose } from '../enums';
import { verificationLinks } from '../schemas/schema';
import type {
  CreateVerificationLinkData,
  VerificationLinkVerificationData,
} from '../types';

@Injectable()
export class VerificationLinksRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createVerificationLink(
    verificationLink: CreateVerificationLinkData,
  ): Promise<void> {
    await this.database.insert(verificationLinks).values(verificationLink);
  }

  @HandleDatabaseError()
  async getVerificationLinkById(
    id: string,
  ): Promise<VerificationLinkVerificationData | undefined> {
    const [verificationLink] = await this.database
      .select(verificationLinkVerificationSelectFields)
      .from(verificationLinks)
      .where(eq(verificationLinks.id, id))
      .limit(1);

    return verificationLink;
  }

  @HandleDatabaseError()
  async markVerificationLinkUsedById(id: string): Promise<boolean> {
    const [verificationLink] = await this.database
      .update(verificationLinks)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(verificationLinks.id, id),
          isNull(verificationLinks.usedAt),
          isNull(verificationLinks.revokedAt),
          gt(verificationLinks.expiresAt, new Date()),
        ),
      )
      .returning({ id: verificationLinks.id });

    return !!verificationLink;
  }

  @HandleDatabaseError()
  async revokeUnusedVerificationLinksByUserIdAndPurpose(
    userId: string,
    purpose: SignupVerificationTokenPurpose,
  ): Promise<void> {
    await this.database
      .update(verificationLinks)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(verificationLinks.userId, userId),
          eq(verificationLinks.purpose, purpose),
          isNull(verificationLinks.usedAt),
          isNull(verificationLinks.revokedAt),
        ),
      );
  }

  @HandleDatabaseError()
  async deleteExpiredVerificationLinks(expiredBefore: Date): Promise<void> {
    await this.database
      .delete(verificationLinks)
      .where(lte(verificationLinks.expiresAt, expiredBefore));
  }
}
