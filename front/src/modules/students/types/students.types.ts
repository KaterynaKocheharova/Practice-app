export interface StudentCard {
  id: string;
  name: string;
  job: string | null;
  hobbies: string[] | null;
}

export interface StudentsPage {
  items: StudentCard[];
  total: number;
}

export interface GetStudentsRequest {
  limit: number;
  offset: number;
}

export interface CreateStudentRequest {
  name: string;
  email?: string;
  birthDate?: string;
  job?: string;
  hobbies?: string[];
}

export interface CreateStudentResponse {
  id: string;
}
