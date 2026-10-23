import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { teachersConfig } from '../config';
import { TeacherGoalStatus } from '../enums';
import type {
  CreateTeacherGoalDto,
  CreateTeacherGoalProgressCheckDto,
  GetTeacherGoalsQueryDto,
  UpdateTeacherGoalDto,
} from '../dto';
import { TeacherGoalWriteOutcome } from '../enums';
import { TeacherGoalsRepository } from '../repositories';
import type {
  TeacherGoalIdResponse,
  TeacherGoalLookupParams,
  TeacherGoalProgressCheckIdResponse,
  TeacherGoalsPageResponse,
  TeacherGoalWriteResult,
} from '../types';

@Injectable()
export class TeacherGoalsService {
  constructor(
    private readonly teacherGoalsRepository: TeacherGoalsRepository,
  ) {}

  async createTeacherGoal(
    teacherId: string,
    { title, details }: CreateTeacherGoalDto,
  ): Promise<TeacherGoalIdResponse> {
    const goal = await this.teacherGoalsRepository.createTeacherGoalWithinLimit(
      { teacherId, title, details },
      teachersConfig.GOALS.MAX_ACTIVE_PER_TEACHER,
    );

    if (!goal) {
      throw new ConflictException({
        errorCode: ERROR_CODE.TEACHER_ACTIVE_GOALS_LIMIT_REACHED,
      });
    }

    return goal;
  }

  async getTeacherGoals(
    teacherId: string,
    { limit, offset, status }: GetTeacherGoalsQueryDto,
  ): Promise<TeacherGoalsPageResponse> {
    const filter = { teacherId, status };
    const [items, total, activeTotal] = await Promise.all([
      this.teacherGoalsRepository.getTeacherGoalCards({
        ...filter,
        limit,
        offset,
      }),
      this.teacherGoalsRepository.countTeacherGoals(filter),
      this.teacherGoalsRepository.countTeacherGoals({
        teacherId,
        status: TeacherGoalStatus.Active,
      }),
    ]);

    return {
      items,
      total,
      activeTotal,
      maxActive: teachersConfig.GOALS.MAX_ACTIVE_PER_TEACHER,
    };
  }

  async updateTeacherGoal(
    params: TeacherGoalLookupParams,
    { title, details }: UpdateTeacherGoalDto,
  ): Promise<TeacherGoalIdResponse> {
    const goal =
      await this.teacherGoalsRepository.updateTeacherGoalWithoutAttempts(
        params,
        { title, details },
      );

    if (goal) {
      return goal;
    }

    const goalId = await this.teacherGoalsRepository.getTeacherGoalId(params);

    if (!goalId) {
      throw this.goalNotFound();
    }

    throw new ConflictException({
      errorCode: ERROR_CODE.TEACHER_GOAL_HAS_ATTEMPTS,
    });
  }

  async deleteTeacherGoal(params: TeacherGoalLookupParams): Promise<void> {
    const goal = await this.teacherGoalsRepository.deleteTeacherGoal(params);

    if (!goal) {
      throw this.goalNotFound();
    }
  }

  async addTeacherGoalAttempt(params: TeacherGoalLookupParams): Promise<void> {
    this.toWriteResponse(
      await this.teacherGoalsRepository.addTeacherGoalAttempt(params),
    );
  }

  async createTeacherGoalProgressCheck(
    params: TeacherGoalLookupParams,
    { status }: CreateTeacherGoalProgressCheckDto,
  ): Promise<TeacherGoalProgressCheckIdResponse> {
    return this.toWriteResponse(
      await this.teacherGoalsRepository.createTeacherGoalProgressCheck({
        ...params,
        status,
      }),
    );
  }

  async completeTeacherGoal(
    params: TeacherGoalLookupParams,
  ): Promise<TeacherGoalIdResponse> {
    return this.toWriteResponse(
      await this.teacherGoalsRepository.completeTeacherGoal(params),
    );
  }

  private toWriteResponse<TData>(result: TeacherGoalWriteResult<TData>): TData {
    switch (result.outcome) {
      case TeacherGoalWriteOutcome.Done:
        return result.data;
      case TeacherGoalWriteOutcome.NotFound:
        throw this.goalNotFound();
      case TeacherGoalWriteOutcome.AlreadyCompleted:
        throw new ConflictException({
          errorCode: ERROR_CODE.TEACHER_GOAL_ALREADY_COMPLETED,
        });
      case TeacherGoalWriteOutcome.ProgressCheckPending:
        throw new ConflictException({
          errorCode: ERROR_CODE.TEACHER_GOAL_PROGRESS_CHECK_PENDING,
        });
      case TeacherGoalWriteOutcome.ProgressCheckNotDue:
        throw new ConflictException({
          errorCode: ERROR_CODE.TEACHER_GOAL_PROGRESS_CHECK_NOT_DUE,
        });
    }
  }

  private goalNotFound(): NotFoundException {
    return new NotFoundException({
      errorCode: ERROR_CODE.TEACHER_GOAL_NOT_FOUND,
    });
  }
}
