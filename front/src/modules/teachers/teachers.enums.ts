export enum TeachersErrorCode {
  ActiveGoalsLimitReached = "TEACHER_ACTIVE_GOALS_LIMIT_REACHED",
  GoalNotFound = "TEACHER_GOAL_NOT_FOUND",
}

export enum TeachersQueryParam {
  Limit = "limit",
  Offset = "offset",
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

export enum TeacherGoalInputType {
  Text = "text",
}
