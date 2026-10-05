import {
  CreateStudentFormField,
  CreateStudentFormFieldId,
  StudentInputType,
} from "./students.enums";

export const STUDENTS_CONFIG = {
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
  },
  hobbiesSeparator: ",",
  pagination: {
    pageSize: 10,
  },
  queryKeys: {
    all: ["students"],
    list: (pageSize: number) => ["students", "list", pageSize],
  },
  validation: {
    emailMaxLength: 255,
    hobbiesMaxCount: 20,
    hobbyMaxLength: 100,
    jobMaxLength: 255,
    nameMaxLength: 255,
  },
} as const;
