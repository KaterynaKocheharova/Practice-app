import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseConfig } from 'src/database/config/config';
import { HandleDatabaseError } from 'src/database/decorators';
import { authSessionRefreshVerificationSelectFields } from '../constants/repository/auth-session-select-fields.constant';
import { authSessions } from '../schemas/schema';
import type {
  AuthSessionRefreshVerificationData,
  CreateAuthSessionData,
} from '../types/auth-session.type';

@Injectable()
export class AuthSessionsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createSession(authSession: CreateAuthSessionData): Promise<void> {
    await this.database.insert(authSessions).values(authSession);
  }

  @HandleDatabaseError()
  async getSessionRefreshVerificationDataById(
    id: string,
  ): Promise<AuthSessionRefreshVerificationData | undefined> {
    const [session] = await this.database
      .select(authSessionRefreshVerificationSelectFields)
      .from(authSessions)
      .where(eq(authSessions.id, id))
      .limit(1);

    return session;
  }
}
