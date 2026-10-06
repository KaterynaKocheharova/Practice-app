import { TEXTS } from "@/modules/common/constants";
import {
  CourseSkill,
  CreateStudentCourseFormField,
  CreateStudentCourseFormFieldId,
  CreateStudentFormField,
  CreateStudentFormFieldId,
  Language,
  LanguageLevel,
  StudentCoursesFilterId,
  StudentInputType,
} from "./students.enums";

const { LANGUAGES, LEVELS, SKILLS } = TEXTS.COURSES;

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
      error: CreateStudentCourseFormFieldId.GrammarLevelError,
      input: CreateStudentCourseFormFieldId.GrammarLevel,
    },
    [CourseSkill.Listening]: {
      error: CreateStudentCourseFormFieldId.ListeningLevelError,
      input: CreateStudentCourseFormFieldId.ListeningLevel,
    },
    [CourseSkill.Reading]: {
      error: CreateStudentCourseFormFieldId.ReadingLevelError,
      input: CreateStudentCourseFormFieldId.ReadingLevel,
    },
    [CourseSkill.Speaking]: {
      error: CreateStudentCourseFormFieldId.SpeakingLevelError,
      input: CreateStudentCourseFormFieldId.SpeakingLevel,
    },
    [CourseSkill.Vocabulary]: {
      error: CreateStudentCourseFormFieldId.VocabularyLevelError,
      input: CreateStudentCourseFormFieldId.VocabularyLevel,
    },
  } satisfies Record<CourseSkill, { error: string; input: string }>,
  filters: {
    courseLanguageId: StudentCoursesFilterId.Language,
  },
  forms: {
    createStudent: {
      fieldIds: CreateStudentFormFieldId,
      fields: CreateStudentFormField,
      inputTypes: {
        birthDate: StudentInputType.Date,
        email: StudentInputType.Email,
        hobbies: StudentInputType.Text,
        job: StudentInputType.Text,
        name: StudentInputType.Text,
      },
    },
    createStudentCourse: {
      fieldIds: CreateStudentCourseFormFieldId,
      fields: CreateStudentCourseFormField,
      inputTypes: {
        learningGoal: StudentInputType.Text,
      },
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
    learningGoalMaxLength: 255,
    nameMaxLength: 255,
    specialGoalMaxLength: 1000,
  },
} as const;
