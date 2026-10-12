export enum StudentFormField {
  BirthDate = "birthDate",
  Hobbies = "hobbies",
  Job = "job",
  Name = "name",
  Root = "root",
}

export enum StudentFormFieldId {
  BirthDate = "student-birth-date",
  BirthDateError = "student-birth-date-error",
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
  Text = "text",
}

export enum StudentsErrorCode {
  CourseAlreadyExists = "STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS",
  CourseDocumentsLimitReached = "COURSE_DOCUMENTS_LIMIT_REACHED",
  MediaAssetPendingLimitReached = "MEDIA_ASSET_PENDING_LIMIT_REACHED",
  StudentNotEditable = "STUDENT_NOT_EDITABLE",
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

export enum StudentCourseFormField {
  Comments = "comments",
  GrammarLevel = "grammarLevel",
  Language = "language",
  LearningGoals = "learningGoals",
  ListeningLevel = "listeningLevel",
  ReadingLevel = "readingLevel",
  Root = "root",
  SpeakingLevel = "speakingLevel",
  SpecialGoal = "specialGoal",
  VocabularyLevel = "vocabularyLevel",
}

export enum StudentCourseFormFieldId {
  Comments = "course-comments",
  CommentsError = "course-comments-error",
  GrammarLevel = "course-grammar-level",
  GrammarLevelError = "course-grammar-level-error",
  Language = "course-language",
  LanguageError = "course-language-error",
  LearningGoals = "course-learning-goals",
  LearningGoalsError = "course-learning-goals-error",
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

export enum CourseDocumentType {
  File = "file",
  Link = "link",
}

export enum MediaAssetKind {
  Audio = "audio",
  Document = "document",
  Image = "image",
}

export enum CourseDocumentFormField {
  File = "file",
  Root = "root",
  Title = "title",
  Url = "url",
}

export enum CourseDocumentFormFieldId {
  AddPanel = "course-document-add-panel",
  File = "course-document-file",
  FileError = "course-document-file-error",
  FileHint = "course-document-file-hint",
  FileTitle = "course-document-file-title",
  FileTitleError = "course-document-file-title-error",
  LinkTitle = "course-document-link-title",
  LinkTitleError = "course-document-link-title-error",
  LinkUrl = "course-document-link-url",
  LinkUrlError = "course-document-link-url-error",
}

export enum CourseDocumentInputType {
  File = "file",
  Text = "text",
  Url = "url",
}
