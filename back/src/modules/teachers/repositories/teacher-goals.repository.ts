import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  notExists,
  type SQL,
} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import type { DatabaseTransaction } from '../../users/types';
import {
  teacherGoalCardSelectFields,
  teacherGoalIdSelectFields,
  teacherSelectFields,
} from '../constants/repository';
import { TeacherGoalStatus } from '../enums';
import { teacherGoalAttempts, teacherGoals, teachers } from '../schemas/schema';
import type {
  CreateTeacherGoalData,
  TeacherGoalCardResponse,
  TeacherGoalIdResponse,
  TeacherGoalLookupParams,
  TeacherGoalsFilterParams,
  TeacherGoalsPageParams,
  UpdateTeacherGoalData,
} from '../types';

@Injectable()
export class TeacherGoalsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createTeacherGoalWithinLimit(
    data: CreateTeacherGoalData,
    maxActiveGoals: number,
  ): Promise<TeacherGoalIdResponse | undefined> {
    return this.database.transaction(async (transaction) => {
      if (
        !(await this.hasActiveGoalCapacity(
          transaction,
          data.teacherId,
          maxActiveGoals,
        ))
      ) {
        return undefined;
      }

      const [goal] = await transaction
        .insert(teacherGoals)
        .values(data)
        .returning(teacherGoalIdSelectFields);

      return goal;
    });
  }

  @HandleDatabaseError()
  async getTeacherGoalCards({
    limit,
    offset,
    ...filter
  }: TeacherGoalsPageParams): Promise<TeacherGoalCardResponse[]> {
    return this.database
      .select({
        ...teacherGoalCardSelectFields,
        attemptCount: this.database.$count(
          teacherGoalAttempts,
          eq(teacherGoalAttempts.teacherGoalId, teacherGoals.id),
        ),
      })
      .from(teacherGoals)
      .where(this.teacherGoalsFilter(filter))
      .orderBy(desc(teacherGoals.createdAt), desc(teacherGoals.id))
      .limit(limit)
      .offset(offset);
  }

  @HandleDatabaseError()
  async countTeacherGoals(filter: TeacherGoalsFilterParams): Promise<number> {
    const [result] = await this.database
      .select({ total: count() })
      .from(teacherGoals)
      .where(this.teacherGoalsFilter(filter));

    return result.total;
  }

  @HandleDatabaseError()
  async getTeacherGoalId(
    params: TeacherGoalLookupParams,
  ): Promise<string | undefined> {
    const [goal] = await this.database
      .select(teacherGoalIdSelectFields)
      .from(teacherGoals)
      .where(this.teacherGoalMatch(params))
      .limit(1);

    return goal?.id;
  }

  @HandleDatabaseError()
  async updateTeacherGoalWithoutAttempts(
    params: TeacherGoalLookupParams,
    data: UpdateTeacherGoalData,
  ): Promise<TeacherGoalIdResponse | undefined> {
    const [goal] = await this.database
      .update(teacherGoals)
      .set(data)
      .where(
        and(
          this.teacherGoalMatch(params),
          notExists(
            this.database
              .select({ id: teacherGoalAttempts.id })
              .from(teacherGoalAttempts)
              .where(eq(teacherGoalAttempts.teacherGoalId, teacherGoals.id)),
          ),
        ),
      )
      .returning(teacherGoalIdSelectFields);

    return goal;
  }

  @HandleDatabaseError()
  async deleteTeacherGoal(
    params: TeacherGoalLookupParams,
  ): Promise<TeacherGoalIdResponse | undefined> {
    const [goal] = await this.database
      .delete(teacherGoals)
      .where(this.teacherGoalMatch(params))
      .returning(teacherGoalIdSelectFields);

    return goal;
  }

  private async hasActiveGoalCapacity(
    transaction: DatabaseTransaction,
    teacherId: string,
    maxActiveGoals: number,
  ): Promise<boolean> {
    // Locks the teacher row so concurrent creates can't both pass the count.
    await transaction
      .select(teacherSelectFields)
      .from(teachers)
      .where(eq(teachers.userId, teacherId))
      .for('update');

    const [result] = await transaction
      .select({ total: count() })
      .from(teacherGoals)
      .where(
        this.teacherGoalsFilter({
          teacherId,
          status: TeacherGoalStatus.Active,
        }),
      );

    return result.total < maxActiveGoals;
  }

  private teacherGoalMatch({
    goalId,
    teacherId,
  }: TeacherGoalLookupParams): SQL | undefined {
    return and(
      eq(teacherGoals.id, goalId),
      eq(teacherGoals.teacherId, teacherId),
    );
  }

  private teacherGoalsFilter({
    teacherId,
    status,
  }: TeacherGoalsFilterParams): SQL | undefined {
    return and(
      eq(teacherGoals.teacherId, teacherId),
      this.statusFilter(status),
    );
  }

  private statusFilter(status: TeacherGoalStatus): SQL | undefined {
    switch (status) {
      case TeacherGoalStatus.Active:
        return isNull(teacherGoals.completedAt);
      case TeacherGoalStatus.Completed:
        return isNotNull(teacherGoals.completedAt);
      case TeacherGoalStatus.All:
        return undefined;
    }
  }
}
