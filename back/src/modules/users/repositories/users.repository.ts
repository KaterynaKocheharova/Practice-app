import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import {
  authSessionUserSelectFields,
  currentUserSelectFields,
  googleAuthUserUpdateSelectFields,
  userGoogleLinkSelectFields,
  userSessionStatusSelectFields,
} from '../constants/repository';
import { teachers } from '../../teachers/schemas/schema';
import { UserRole } from '../enums';
import { users } from '../schemas/schema';
import type {
  CreateUserData,
  CurrentUserData,
  DatabaseTransaction,
  UserAuthSessionData,
  UserGoogleLinkData,
  UserRoleProfileData,
  UserSessionStatusData,
} from '../types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createGoogleAuthUser(
    user: CreateUserData,
  ): Promise<UserAuthSessionData> {
    const [createdUser] = await this.database
      .insert(users)
      .values(user)
      .returning(authSessionUserSelectFields);

    return createdUser;
  }

  @HandleDatabaseError()
  async getUserSessionStatusById(
    id: string,
  ): Promise<UserSessionStatusData | undefined> {
    const [user] = await this.database
      .select(userSessionStatusSelectFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  @HandleDatabaseError()
  async getCurrentUserDataById(
    id: string,
  ): Promise<CurrentUserData | undefined> {
    const [user] = await this.database
      .select(currentUserSelectFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  @HandleDatabaseError()
  async getUserIdById(id: string): Promise<string | undefined> {
    const [user] = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user?.id;
  }

  @HandleDatabaseError()
  async getGoogleLinkDataByEmail(
    email: string,
  ): Promise<UserGoogleLinkData | undefined> {
    const [user] = await this.database
      .select(userGoogleLinkSelectFields)
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  @HandleDatabaseError()
  async getUserIdByGoogleId(googleId: string): Promise<string | undefined> {
    const [user] = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);

    return user?.id;
  }

  @HandleDatabaseError()
  async updateGoogleAuthUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<UserAuthSessionData> {
    return this.database.transaction(async (transaction) => {
      const [updatedUser] = await transaction
        .update(users)
        .set(user)
        .where(eq(users.id, id))
        .returning(googleAuthUserUpdateSelectFields);

      await this.ensureRoleProfile(transaction, updatedUser);

      return { id: updatedUser.id, email: updatedUser.email };
    });
  }

  /**
   * Every active teacher user must have a `teachers` row; idempotent so it
   * can run on each Google sign-in.
   */
  private async ensureRoleProfile(
    transaction: DatabaseTransaction,
    user: UserRoleProfileData,
  ): Promise<void> {
    if (user.role !== UserRole.Teacher) {
      return;
    }

    await transaction
      .insert(teachers)
      .values({ userId: user.id })
      .onConflictDoNothing();
  }
}
