import { TEXTS } from "@/modules/common/constants";
import {
  CourseSkill,
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
  filters: {
    courseLanguageId: StudentCoursesFilterId.Language,
  },
  forms: {
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
  queryKeys: {
    all: ["students"],
    list: (pageSize: number) => ["students", "list", pageSize],
    detail: (studentId: string) => ["students", "detail", studentId],
    courses: (studentId: string) => [
      "students",
      "detail",
      studentId,
      "courses",
    ],
    availableLanguages: (studentId: string) => [
      "students",
      "detail",
      studentId,
      "courses",
      "available-languages",
    ],
    courseList: (studentId: string, language: Language | null) => [
      "students",
      "detail",
      studentId,
      "courses",
      "list",
      language,
    ],
    course: (studentId: string, courseId: string) => [
      "students",
      "detail",
      studentId,
      "courses",
      "item",
      courseId,
    ],
  },
  skeletons: {
    courses: 3,
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
