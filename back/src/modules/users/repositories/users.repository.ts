import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { userSelectFields } from '../constants/repository';
import { users } from '../schemas/schema';
import type { CreateUserData, SafeUserData } from '../types';

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
  async getUserById(id: string): Promise<SafeUserData | undefined> {
    const [user] = await this.database
      .select(userSelectFields)
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
}
