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
  EmailAlreadyExists = "USER_WITH_EMAIL_ALREADY_EXISTS",
}

export enum StudentsQueryParam {
  Limit = "limit",
  Offset = "offset",
}
