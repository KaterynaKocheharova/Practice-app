import { TEXTS } from "@/modules/common/constants";
import { UserRole } from "@/modules/auth/auth.enums";
import {
  CourseDocumentFormField,
  CourseDocumentFormFieldId,
  CourseDocumentInputType,
  CourseSkill,
  MediaAssetKind,
  StudentCourseFormField,
  StudentCourseFormFieldId,
  StudentFormField,
  StudentFormFieldId,
  Language,
  LanguageLevel,
  LearningGoal,
  StudentCoursesFilterId,
  StudentInputType,
} from "./students.enums";

const { LANGUAGES, LEARNING_GOALS, LEVELS, SKILLS } = TEXTS.COURSES;
const { ROLES } = TEXTS.COURSES.DOCUMENTS;
const BYTES_IN_MEGABYTE = 1024 * 1024;

export const STUDENTS_CONFIG = {
  courseLabels: {
    languages: {
      [Language.Chinese]: LANGUAGES.CHINESE,
      [Language.English]: LANGUAGES.ENGLISH,
      [Language.French]: LANGUAGES.FRENCH,
      [Language.German]: LANGUAGES.GERMAN,
      [Language.Italian]: LANGUAGES.ITALIAN,
      [Language.Polish]: LANGUAGES.POLISH,
      [Language.Spanish]: LANGUAGES.SPANISH,
      [Language.Ukrainian]: LANGUAGES.UKRAINIAN,
    } satisfies Record<Language, string>,
    learningGoals: {
      [LearningGoal.Academic]: LEARNING_GOALS.ACADEMIC,
      [LearningGoal.Business]: LEARNING_GOALS.BUSINESS,
      [LearningGoal.Conversation]: LEARNING_GOALS.CONVERSATION,
      [LearningGoal.ExamPreparation]: LEARNING_GOALS.EXAM_PREPARATION,
      [LearningGoal.Grammar]: LEARNING_GOALS.GRAMMAR,
      [LearningGoal.Other]: LEARNING_GOALS.OTHER,
      [LearningGoal.Pronunciation]: LEARNING_GOALS.PRONUNCIATION,
      [LearningGoal.Travel]: LEARNING_GOALS.TRAVEL,
      [LearningGoal.Vocabulary]: LEARNING_GOALS.VOCABULARY,
    } satisfies Record<LearningGoal, string>,
    levels: {
      [LanguageLevel.A0]: LEVELS.A0,
      [LanguageLevel.A1]: LEVELS.A1,
      [LanguageLevel.A1Plus]: LEVELS.A1_PLUS,
      [LanguageLevel.A2]: LEVELS.A2,
      [LanguageLevel.A2Plus]: LEVELS.A2_PLUS,
      [LanguageLevel.B1]: LEVELS.B1,
      [LanguageLevel.B1Plus]: LEVELS.B1_PLUS,
      [LanguageLevel.B2]: LEVELS.B2,
      [LanguageLevel.B2Plus]: LEVELS.B2_PLUS,
      [LanguageLevel.C1]: LEVELS.C1,
      [LanguageLevel.C1Plus]: LEVELS.C1_PLUS,
      [LanguageLevel.C2]: LEVELS.C2,
    } satisfies Record<LanguageLevel, string>,
    skills: {
      [CourseSkill.Grammar]: SKILLS.GRAMMAR,
      [CourseSkill.Listening]: SKILLS.LISTENING,
      [CourseSkill.Reading]: SKILLS.READING,
      [CourseSkill.Speaking]: SKILLS.SPEAKING,
      [CourseSkill.Vocabulary]: SKILLS.VOCABULARY,
    } satisfies Record<CourseSkill, string>,
  },
  courseSkills: [
    CourseSkill.Grammar,
    CourseSkill.Vocabulary,
    CourseSkill.Speaking,
    CourseSkill.Reading,
    CourseSkill.Listening,
  ],
  courseSkillFieldIds: {
    [CourseSkill.Grammar]: {
      error: StudentCourseFormFieldId.GrammarLevelError,
      input: StudentCourseFormFieldId.GrammarLevel,
    },
    [CourseSkill.Listening]: {
      error: StudentCourseFormFieldId.ListeningLevelError,
      input: StudentCourseFormFieldId.ListeningLevel,
    },
    [CourseSkill.Reading]: {
      error: StudentCourseFormFieldId.ReadingLevelError,
      input: StudentCourseFormFieldId.ReadingLevel,
    },
    [CourseSkill.Speaking]: {
      error: StudentCourseFormFieldId.SpeakingLevelError,
      input: StudentCourseFormFieldId.SpeakingLevel,
    },
    [CourseSkill.Vocabulary]: {
      error: StudentCourseFormFieldId.VocabularyLevelError,
      input: StudentCourseFormFieldId.VocabularyLevel,
    },
  } satisfies Record<CourseSkill, { error: string; input: string }>,
  /** Mirrors the backend upload rules (media-assets config). */
  documents: {
    accept:
      ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.txt,.csv,.jpg,.jpeg,.png,.webp,.mp3,.m4a,.wav,.ogg",
    allowedMimeTypes: {
      "application/pdf": MediaAssetKind.Document,
      "application/msword": MediaAssetKind.Document,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        MediaAssetKind.Document,
      "application/vnd.ms-excel": MediaAssetKind.Document,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        MediaAssetKind.Document,
      "application/vnd.ms-powerpoint": MediaAssetKind.Document,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        MediaAssetKind.Document,
      "application/vnd.oasis.opendocument.text": MediaAssetKind.Document,
      "application/vnd.oasis.opendocument.spreadsheet": MediaAssetKind.Document,
      "text/plain": MediaAssetKind.Document,
      "text/csv": MediaAssetKind.Document,
      "image/jpeg": MediaAssetKind.Image,
      "image/png": MediaAssetKind.Image,
      "image/webp": MediaAssetKind.Image,
      "audio/mpeg": MediaAssetKind.Audio,
      "audio/mp4": MediaAssetKind.Audio,
      "audio/x-m4a": MediaAssetKind.Audio,
      "audio/wav": MediaAssetKind.Audio,
      "audio/x-wav": MediaAssetKind.Audio,
      "audio/ogg": MediaAssetKind.Audio,
    } as Partial<Record<string, MediaAssetKind>>,
    maxSizeBytes: {
      [MediaAssetKind.Audio]: 50 * BYTES_IN_MEGABYTE,
      [MediaAssetKind.Document]: 20 * BYTES_IN_MEGABYTE,
      [MediaAssetKind.Image]: 10 * BYTES_IN_MEGABYTE,
    } satisfies Record<MediaAssetKind, number>,
    roleLabels: {
      [UserRole.Student]: ROLES.STUDENT,
      [UserRole.Teacher]: ROLES.TEACHER,
    } satisfies Record<UserRole, string>,
    titleMaxLength: 255,
    urlMaxLength: 2048,
    urlProtocol: /^https$/,
  },
  filters: {
    courseLanguageId: StudentCoursesFilterId.Language,
  },
  forms: {
    courseDocument: {
      fieldIds: CourseDocumentFormFieldId,
      fields: CourseDocumentFormField,
      inputTypes: {
        file: CourseDocumentInputType.File,
        title: CourseDocumentInputType.Text,
        url: CourseDocumentInputType.Url,
      },
    },
    student: {
      fieldIds: StudentFormFieldId,
      fields: StudentFormField,
      inputTypes: {
        birthDate: StudentInputType.Date,
        email: StudentInputType.Email,
        hobbies: StudentInputType.Text,
        job: StudentInputType.Text,
        name: StudentInputType.Text,
      },
    },
    studentCourse: {
      fieldIds: StudentCourseFormFieldId,
      fields: StudentCourseFormField,
    },
  },
  hobbiesSeparator: ",",
  pagination: {
    pageSize: 10,
  },
  validation: {
    commentsMaxLength: 5000,
    emailMaxLength: 255,
    hobbiesMaxCount: 20,
    hobbyMaxLength: 100,
    jobMaxLength: 255,
    nameMaxLength: 255,
    specialGoalMaxLength: 1000,
  },
} as const;
