export const COMPLETE_TEACHER_GOAL_SWAGGER = {
  SUMMARY: 'Complete a goal',
  DESCRIPTION:
    'Marks an active goal of the calling teacher as completed, which frees one active-goal slot. A completed goal accepts no new attempts and cannot be reopened.',
  OK_RESPONSE_DESCRIPTION: 'Goal completed. Returns the id of the goal.',
} as const;
