export enum CreateStudentFormField {
  BirthDate = "birthDate",
  Email = "email",
  Hobbies = "hobbies",
  Job = "job",
  Name = "name",
  Root = "root",
}

export enum CreateStudentFormFieldId {
  BirthDate = "student-birth-date",
  BirthDateError = "student-birth-date-error",
  Email = "student-email",
  EmailError = "student-email-error",
  Hobbies = "student-hobbies",
  HobbiesError = "student-hobbies-error",
  HobbiesHint = "student-hobbies-hint",
  Job = "student-job",
  JobError = "student-job-error",
  Name = "student-name",
  NameError = "student-name-error",
}

export enum StudentInputType {
  Date = "date",
  Email = "email",
  Text = "text",
}

export enum StudentsErrorCode {
  CourseAlreadyExists = "STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS",
  EmailAlreadyExists = "USER_WITH_EMAIL_ALREADY_EXISTS",
}

export enum StudentsQueryParam {
  Language = "language",
  Limit = "limit",
  Offset = "offset",
}

export enum Language {
  Chinese = "chinese",
  English = "english",
  French = "french",
  German = "german",
  Italian = "italian",
  Polish = "polish",
  Spanish = "spanish",
  Ukrainian = "ukrainian",
}

export enum LanguageLevel {
  A0 = "a0",
  A1 = "a1",
  A1Plus = "a1_plus",
  A2 = "a2",
  A2Plus = "a2_plus",
  B1 = "b1",
  B1Plus = "b1_plus",
  B2 = "b2",
  B2Plus = "b2_plus",
  C1 = "c1",
  C1Plus = "c1_plus",
  C2 = "c2",
}

export enum LearningGoal {
  Academic = "academic",
  Business = "business",
  Conversation = "conversation",
  ExamPreparation = "exam_preparation",
  Grammar = "grammar",
  Other = "other",
  Pronunciation = "pronunciation",
  Travel = "travel",
  Vocabulary = "vocabulary",
}

export enum CourseSkill {
  Grammar = "grammarLevel",
  Listening = "listeningLevel",
  Reading = "readingLevel",
  Speaking = "speakingLevel",
  Vocabulary = "vocabularyLevel",
}

export enum CreateStudentCourseFormField {
  Comments = "comments",
  GrammarLevel = "grammarLevel",
  Language = "language",
  LearningGoal = "learningGoal",
  ListeningLevel = "listeningLevel",
  ReadingLevel = "readingLevel",
  Root = "root",
  SpeakingLevel = "speakingLevel",
  SpecialGoal = "specialGoal",
  VocabularyLevel = "vocabularyLevel",
}

export enum CreateStudentCourseFormFieldId {
  Comments = "course-comments",
  CommentsError = "course-comments-error",
  GrammarLevel = "course-grammar-level",
  GrammarLevelError = "course-grammar-level-error",
  Language = "course-language",
  LanguageError = "course-language-error",
  LearningGoal = "course-learning-goal",
  LearningGoalError = "course-learning-goal-error",
  ListeningLevel = "course-listening-level",
  ListeningLevelError = "course-listening-level-error",
  ReadingLevel = "course-reading-level",
  ReadingLevelError = "course-reading-level-error",
  SpeakingLevel = "course-speaking-level",
  SpeakingLevelError = "course-speaking-level-error",
  SpecialGoal = "course-special-goal",
  SpecialGoalError = "course-special-goal-error",
  VocabularyLevel = "course-vocabulary-level",
  VocabularyLevelError = "course-vocabulary-level-error",
}

export enum StudentCoursesFilterId {
  Language = "courses-language-filter",
}

export enum StudentsHeadingLevel {
  H1 = "h1",
  H2 = "h2",
}
