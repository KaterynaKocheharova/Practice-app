import { teachers } from '../schemas/schema';

export type CreateTeacherData = typeof teachers.$inferInsert;
export type TeacherData = typeof teachers.$inferSelect;
