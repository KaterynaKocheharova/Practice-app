import { students } from '../schemas/schema';

type StudentInsertData = typeof students.$inferInsert;

export type CreateStudentData = Omit<StudentInsertData, 'teacherId'> & {
  teacherId: string;
};

export type StudentData = typeof students.$inferSelect;
