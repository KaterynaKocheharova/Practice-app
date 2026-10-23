import { TEXTS } from "@/modules/common/constants";
import {
  GoalProgressStatus,
  TeacherGoalFormField,
  TeacherGoalFormFieldId,
  TeacherGoalInputType,
  TeacherGoalsFilterId,
  TeacherGoalStatus,
} from "./teachers.enums";

const { GOALS } = TEXTS;

export const TEACHERS_CONFIG = {
  dateFormat: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
      year: "numeric",
    } satisfies Intl.DateTimeFormatOptions,
  },
  filters: {
    defaultStatus: TeacherGoalStatus.Active,
    statusId: TeacherGoalsFilterId.Status,
  },
  forms: {
    goal: {
      fieldIds: TeacherGoalFormFieldId,
      fields: TeacherGoalFormField,
      inputTypes: {
        title: TeacherGoalInputType.Text,
      },
    },
  },
  goalLabels: {
    emptyMessages: {
      [TeacherGoalStatus.Active]: GOALS.EMPTY_ACTIVE,
      [TeacherGoalStatus.All]: GOALS.EMPTY,
      [TeacherGoalStatus.Completed]: GOALS.EMPTY_COMPLETED,
    },
    progressStatuses: {
      [GoalProgressStatus.Success]: GOALS.PROGRESS.SUCCESS,
      [GoalProgressStatus.Same]: GOALS.PROGRESS.SAME,
      [GoalProgressStatus.Worse]: GOALS.PROGRESS.WORSE,
    },
    statuses: {
      [TeacherGoalStatus.Active]: GOALS.ACTIVE,
      [TeacherGoalStatus.Completed]: GOALS.COMPLETED,
      [TeacherGoalStatus.All]: GOALS.ALL,
    },
  },
  pagination: {
    pageSize: 20,
  },
  validation: {
    goalDetailsMaxLength: 2000,
    goalTitleMaxLength: 255,
  },
} as const;
