export const DELETE_TEACHER_GOAL_SWAGGER = {
  SUMMARY: 'Delete a goal',
  DESCRIPTION:
    'Permanently deletes a goal of the calling teacher together with its marks and progress answers. Allowed at any time.',
  NO_CONTENT_RESPONSE_DESCRIPTION: 'Goal deleted.',
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Returned when the id is not a valid UUID.',
} as const;
