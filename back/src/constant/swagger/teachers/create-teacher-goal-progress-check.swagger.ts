import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { GoalProgressStatus } from 'src/modules/teachers/enums';
import { TEACHER_GOAL_PATH } from './teacher-goals.swagger';

export const CREATE_TEACHER_GOAL_PROGRESS_CHECK_SWAGGER = {
  SUMMARY: 'Mark progress on a goal',
  DESCRIPTION:
    'Answers the progress check that is due for a goal of the calling teacher (`progressCheckDue: true`). The check is tied to the current attempt count, which unblocks new attempts and completion.',
  BODY: {
    STATUS: {
      EXAMPLE: GoalProgressStatus.Success,
      DESCRIPTION: 'How the teacher rates their progress since the last check.',
    },
  },
  REQUEST_BODY_DESCRIPTION: 'The progress answer.',
  CREATED_RESPONSE_DESCRIPTION:
    'Progress check saved. Returns the id of the progress check.',
  CREATED_RESPONSE_EXAMPLE: {
    id: '2b3c4d5e-6f70-4a81-92a3-b4c5d6e7f809',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the id is not a valid UUID or the body is invalid or has unknown fields.',
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when no progress check is due for the goal right now.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.TEACHER_GOAL_PROGRESS_CHECK_NOT_DUE,
    message: 'Progress cannot be marked for this goal right now.',
    path: `${TEACHER_GOAL_PATH}/progress-checks`,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
