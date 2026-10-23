import { ERRORS } from "@/modules/common/constants";
import { TeachersErrorCode } from "../teachers.enums";

const TEACHER_GOAL_ERROR_MESSAGES: Partial<Record<string, string>> = {
  [TeachersErrorCode.ActiveGoalsLimitReached]:
    ERRORS.TEACHER_GOALS.ACTIVE_LIMIT_REACHED,
  [TeachersErrorCode.GoalAlreadyCompleted]:
    ERRORS.TEACHER_GOALS.ALREADY_COMPLETED,
  [TeachersErrorCode.GoalNotFound]: ERRORS.TEACHER_GOALS.NOT_FOUND,
  [TeachersErrorCode.GoalProgressCheckNotDue]:
    ERRORS.TEACHER_GOALS.PROGRESS_CHECK_NOT_DUE,
  [TeachersErrorCode.GoalProgressCheckPending]:
    ERRORS.TEACHER_GOALS.PROGRESS_CHECK_PENDING,
};

export const getTeacherGoalErrorMessage = (
  errorCode: string | null,
  fallbackMessage: string,
): string => TEACHER_GOAL_ERROR_MESSAGES[errorCode ?? ""] ?? fallbackMessage;
