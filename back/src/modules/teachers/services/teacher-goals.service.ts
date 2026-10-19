import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import { teachersConfig } from '../config';
import type {
  CreateTeacherGoalDto,
  GetTeacherGoalsQueryDto,
  UpdateTeacherGoalDto,
} from '../dto';
import { TeacherGoalsRepository } from '../repositories';
import type {
  TeacherGoalIdResponse,
  TeacherGoalLookupParams,
  TeacherGoalsPageResponse,
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
    const filter = { teacherId, status: status ?? null };
    const [items, total] = await Promise.all([
      this.teacherGoalsRepository.getTeacherGoalCards({
        ...filter,
        limit,
        offset,
      }),
      this.teacherGoalsRepository.countTeacherGoals(filter),
    ]);

    return { items, total };
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

  private goalNotFound(): NotFoundException {
    return new NotFoundException({
      errorCode: ERROR_CODE.TEACHER_GOAL_NOT_FOUND,
    });
  }
}
