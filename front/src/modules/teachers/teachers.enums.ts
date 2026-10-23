export enum TeachersErrorCode {
  ActiveGoalsLimitReached = "TEACHER_ACTIVE_GOALS_LIMIT_REACHED",
  GoalAlreadyCompleted = "TEACHER_GOAL_ALREADY_COMPLETED",
  GoalNotFound = "TEACHER_GOAL_NOT_FOUND",
  GoalProgressCheckNotDue = "TEACHER_GOAL_PROGRESS_CHECK_NOT_DUE",
  GoalProgressCheckPending = "TEACHER_GOAL_PROGRESS_CHECK_PENDING",
}

export enum TeachersQueryParam {
  Limit = "limit",
  Offset = "offset",
  Status = "status",
}

export enum TeacherGoalFormField {
  Details = "details",
  Root = "root",
  Title = "title",
}

export enum TeacherGoalFormFieldId {
  AddPanel = "teacher-goal-add-panel",
  Details = "teacher-goal-details",
  DetailsError = "teacher-goal-details-error",
  Title = "teacher-goal-title",
  TitleError = "teacher-goal-title-error",
}

export enum TeacherGoalsFilterId {
  Status = "teacher-goals-status-filter",
}

export enum TeacherGoalInputType {
  Text = "text",
}

export enum TeacherGoalStatus {
  Active = "active",
  All = "all",
  Completed = "completed",
}

export enum GoalProgressStatus {
  Same = "same",
  Success = "success",
  Worse = "worse",
}
