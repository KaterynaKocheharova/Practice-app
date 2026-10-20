import {
  TeacherGoalFormField,
  TeacherGoalFormFieldId,
  TeacherGoalInputType,
} from "./teachers.enums";

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
  forms: {
    goal: {
      fieldIds: TeacherGoalFormFieldId,
      fields: TeacherGoalFormField,
      inputTypes: {
        title: TeacherGoalInputType.Text,
      },
    },
  },
  goals: {
    maxActive: 3,
  },
  pagination: {
    pageSize: 20,
  },
  validation: {
    goalDetailsMaxLength: 2000,
    goalTitleMaxLength: 255,
  },
} as const;
