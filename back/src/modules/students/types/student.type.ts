import type {
  CreateUserData,
  CurrentUserResponse,
  UserData,
} from '../../users/types';
import { students } from '../schemas/schema';

type StudentInsertData = typeof students.$inferInsert;
type StudentRowData = typeof students.$inferSelect;

export type CreateManagedStudentData = {
  user: Pick<CreateUserData, 'name' | 'email' | 'role' | 'status'>;
  student: Pick<
    StudentInsertData,
    'createdByTeacherId' | 'birthDate' | 'job' | 'hobbies'
  >;
};

export type CreatedStudentResponse = {
  id: string;
};

export type ManagedStudentLookupParams = {
  studentId: string;
  teacherId: string;
};

/** The authenticated user requesting student data. */
export type StudentViewer = Pick<CurrentUserResponse, 'id' | 'role'>;

export type StudentAccessParams = {
  viewer: StudentViewer;
  studentId: string;
};

export type TeacherStudentsFilterParams = {
  teacherId: string;
  /** Matches students whose name or email starts with it. */
  search: string | null;
};

export type TeacherStudentsPageParams = TeacherStudentsFilterParams & {
  limit: number;
  offset: number;
};

export type StudentCardResponse = Pick<StudentRowData, 'job' | 'hobbies'> &
  Pick<UserData, 'id' | 'name'>;

export type StudentsPageResponse = {
  items: StudentCardResponse[];
  total: number;
};

export type StudentDetailsResponse = Pick<
  StudentRowData,
  'birthDate' | 'job' | 'hobbies'
> &
  Pick<UserData, 'id' | 'name' | 'email' | 'status'>;
