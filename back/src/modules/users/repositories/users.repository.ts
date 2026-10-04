import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import {
  authSessionUserSelectFields,
  currentUserSelectFields,
  userAuthVerificationSelectFields,
  userGoogleLinkSelectFields,
  userRoleProfileSelectFields,
  userSelectFields,
} from '../constants/repository';
import { teachers } from '../../teachers/schemas/schema';
import { UserRole, UserStatus } from '../enums';
import { users } from '../schemas/schema';
import type {
  CreateUserData,
  CurrentUserData,
  DatabaseTransaction,
  SafeUserData,
  UserAuthSessionData,
  UserAuthVerificationData,
  UserGoogleLinkData,
  UserRoleProfileData,
} from '../types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createUser(user: CreateUserData): Promise<SafeUserData> {
    const [createdUser] = await this.database
      .insert(users)
      .values(user)
      .returning(userSelectFields);

    return createdUser;
  }

  @HandleDatabaseError()
  async createGoogleAuthUser(
    user: CreateUserData,
  ): Promise<UserAuthSessionData> {
    return this.database.transaction(async (transaction) => {
      const [createdUser] = await transaction
        .insert(users)
        .values(user)
        .returning(authSessionUserSelectFields);

      await this.ensureRoleProfile(transaction, createdUser);

      return createdUser;
    });
  }

  @HandleDatabaseError()
  async getUserById(id: string): Promise<SafeUserData | undefined> {
    const [user] = await this.database
      .select(userSelectFields)
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
  async getUserByEmail(email: string): Promise<SafeUserData | undefined> {
    const [user] = await this.database
      .select(userSelectFields)
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
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
  async getUserAuthVerificationDataByEmail(
    email: string,
  ): Promise<UserAuthVerificationData | undefined> {
    const [user] = await this.database
      .select(userAuthVerificationSelectFields)
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  @HandleDatabaseError()
  async getUserIdByEmail(email: string): Promise<string | undefined> {
    const [user] = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user?.id;
  }

  @HandleDatabaseError()
  async updateUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<SafeUserData> {
    const [updatedUser] = await this.database
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning(userSelectFields);

    return updatedUser;
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
        .returning(authSessionUserSelectFields);

      await this.ensureRoleProfile(transaction, updatedUser);

      return updatedUser;
    });
  }

  @HandleDatabaseError()
  async activateUserById(id: string): Promise<void> {
    await this.database.transaction(async (transaction) => {
      const [activatedUser] = await transaction
        .update(users)
        .set({ status: UserStatus.Active })
        .where(eq(users.id, id))
        .returning(userRoleProfileSelectFields);

      await this.ensureRoleProfile(transaction, activatedUser);
    });
  }

  /**
   * Every active teacher user must have a `teachers` row; idempotent so it
   * can run on each activation or Google sign-in.
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
