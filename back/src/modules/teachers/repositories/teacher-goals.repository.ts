import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  notExists,
  sql,
  type SQL,
} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import type { DatabaseTransaction } from '../../users/types';
import { teachersConfig } from '../config';
import {
  teacherGoalCardSelectFields,
  teacherGoalIdSelectFields,
  teacherGoalProgressCheckIdSelectFields,
  teacherGoalStateSelectFields,
  teacherSelectFields,
} from '../constants/repository';
import { TeacherGoalStatus, TeacherGoalWriteOutcome } from '../enums';
import {
  teacherGoalAttempts,
  teacherGoalProgressChecks,
  teacherGoals,
  teachers,
} from '../schemas/schema';
import type {
  ActiveTeacherGoalBlocker,
  CreateTeacherGoalData,
  CreateTeacherGoalProgressCheckData,
  TeacherGoalCardResponse,
  TeacherGoalIdResponse,
  TeacherGoalLookupParams,
  TeacherGoalProgressCheckIdResponse,
  TeacherGoalStateData,
  TeacherGoalsFilterParams,
  TeacherGoalsPageParams,
  TeacherGoalWriteResult,
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
        ...this.progressSelectFields(),
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

  @HandleDatabaseError()
  async addTeacherGoalAttempt(
    params: TeacherGoalLookupParams,
  ): Promise<TeacherGoalWriteResult<void>> {
    return this.database.transaction(async (transaction) => {
      const state = await this.lockTeacherGoalState(transaction, params);

      if (!state) {
        return { outcome: TeacherGoalWriteOutcome.NotFound };
      }

      const blocker = this.activeGoalBlocker(state);

      if (blocker) {
        return { outcome: blocker };
      }

      await transaction
        .insert(teacherGoalAttempts)
        .values({ teacherGoalId: params.goalId });

      return { outcome: TeacherGoalWriteOutcome.Done, data: undefined };
    });
  }

  @HandleDatabaseError()
  async createTeacherGoalProgressCheck({
    status,
    ...params
  }: CreateTeacherGoalProgressCheckData): Promise<
    TeacherGoalWriteResult<TeacherGoalProgressCheckIdResponse>
  > {
    return this.database.transaction(async (transaction) => {
      const state = await this.lockTeacherGoalState(transaction, params);

      if (!state) {
        return { outcome: TeacherGoalWriteOutcome.NotFound };
      }

      if (!state.progressCheckDue) {
        return { outcome: TeacherGoalWriteOutcome.ProgressCheckNotDue };
      }

      const [progressCheck] = await transaction
        .insert(teacherGoalProgressChecks)
        .values({
          teacherGoalId: params.goalId,
          attemptNumber: state.attemptCount,
          status,
        })
        .returning(teacherGoalProgressCheckIdSelectFields);

      return { outcome: TeacherGoalWriteOutcome.Done, data: progressCheck };
    });
  }

  @HandleDatabaseError()
  async completeTeacherGoal(
    params: TeacherGoalLookupParams,
  ): Promise<TeacherGoalWriteResult<TeacherGoalIdResponse>> {
    return this.database.transaction(async (transaction) => {
      const state = await this.lockTeacherGoalState(transaction, params);

      if (!state) {
        return { outcome: TeacherGoalWriteOutcome.NotFound };
      }

      const blocker = this.activeGoalBlocker(state);

      if (blocker) {
        return { outcome: blocker };
      }

      const [goal] = await transaction
        .update(teacherGoals)
        .set({ completedAt: new Date() })
        .where(eq(teacherGoals.id, params.goalId))
        .returning(teacherGoalIdSelectFields);

      return { outcome: TeacherGoalWriteOutcome.Done, data: goal };
    });
  }

  private async lockTeacherGoalState(
    transaction: DatabaseTransaction,
    params: TeacherGoalLookupParams,
  ): Promise<TeacherGoalStateData | undefined> {
    const [goal] = await transaction
      .select(teacherGoalIdSelectFields)
      .from(teacherGoals)
      .where(this.teacherGoalMatch(params))
      .for('update');

    if (!goal) {
      return undefined;
    }

    // Read after locking, in a new statement: subqueries of a FOR UPDATE that had to wait still see the pre-wait snapshot.
    const [state] = await transaction
      .select({
        ...teacherGoalStateSelectFields,
        ...this.progressSelectFields(),
      })
      .from(teacherGoals)
      .where(eq(teacherGoals.id, goal.id));

    return state;
  }

  private activeGoalBlocker(
    state: TeacherGoalStateData,
  ): ActiveTeacherGoalBlocker | undefined {
    if (state.completedAt) {
      return TeacherGoalWriteOutcome.AlreadyCompleted;
    }

    if (state.progressCheckDue) {
      return TeacherGoalWriteOutcome.ProgressCheckPending;
    }

    return undefined;
  }

  private progressSelectFields() {
    const attemptCount = this.database.$count(
      teacherGoalAttempts,
      eq(teacherGoalAttempts.teacherGoalId, teacherGoals.id),
    );
    const answeredCheck = this.database
      .select(teacherGoalProgressCheckIdSelectFields)
      .from(teacherGoalProgressChecks)
      .where(
        and(
          eq(teacherGoalProgressChecks.teacherGoalId, teacherGoals.id),
          eq(teacherGoalProgressChecks.attemptNumber, attemptCount),
        ),
      );

    return {
      attemptCount,
      progressCheckDue: sql<boolean>`(${attemptCount} > 0 AND ${attemptCount} % ${teachersConfig.GOALS.PROGRESS_CHECK_INTERVAL} = 0 AND ${notExists(answeredCheck)})`,
    };
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

  private statusFilter(
    status: TeacherGoalsFilterParams['status'],
  ): SQL | undefined {
    if (status === TeacherGoalStatus.Active) {
      return isNull(teacherGoals.completedAt);
    }

    if (status === TeacherGoalStatus.Completed) {
      return isNotNull(teacherGoals.completedAt);
    }

    return undefined;
  }
}
