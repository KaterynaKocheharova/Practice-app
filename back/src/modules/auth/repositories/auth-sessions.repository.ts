import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseConfig } from 'src/database/config/config';
import { HandleDatabaseError } from 'src/database/decorators';
import { authSessionRefreshTokenSelectFields } from '../constants/repository/auth-session-select-fields.constant';
import { authSessions } from '../schemas/schema';
import type {
  AuthSessionRefreshTokenData,
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
  async getSessionRefreshTokenDataById(
    id: string,
  ): Promise<AuthSessionRefreshTokenData | undefined> {
    const [session] = await this.database
      .select(authSessionRefreshTokenSelectFields)
      .from(authSessions)
      .where(eq(authSessions.id, id))
      .limit(1);

    return session;
  }

  @HandleDatabaseError()
  async revokeSessionById(id: string, replacedBy?: string): Promise<void> {
    await this.database
      .update(authSessions)
      .set({
        revokedAt: new Date(),
        ...(replacedBy ? { replacedBy } : {}),
      })
      .where(and(eq(authSessions.id, id), isNull(authSessions.revokedAt)));
  }

  @HandleDatabaseError()
  async revokeSessionsByUserId(userId: string): Promise<void> {
    await this.database
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(authSessions.userId, userId), isNull(authSessions.revokedAt)),
      );
  }
}
