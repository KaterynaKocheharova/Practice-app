export const studentsConfig = {
  VALIDATION: {
    NAME_MAX_LENGTH: 255,
    JOB_MAX_LENGTH: 255,
    HOBBY_MAX_LENGTH: 100,
    HOBBIES_MAX_COUNT: 20,
    SPECIAL_GOAL_MAX_LENGTH: 1000,
    COMMENTS_MAX_LENGTH: 5000,
    DOCUMENT_TITLE_MAX_LENGTH: 255,
    DOCUMENT_URL_MAX_LENGTH: 2048,
    DOCUMENT_URL_PROTOCOLS: ['https'],
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0,
  },
  COURSE_DOCUMENTS: {
    MAX_PER_COURSE: 100,
    QUEUE: {
      NAME: 'course-documents',
    },
    JOBS: {
      PURGE_COURSE_DOCUMENT: 'purge-course-document',
    },
    JOB_OPTIONS: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  },
} as const;
