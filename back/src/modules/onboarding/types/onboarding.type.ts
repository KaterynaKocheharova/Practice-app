import type { students } from 'src/modules/students/schemas/schema';

export interface CompleteOnboardingData {
  userId: string;
  name: string;
}

export type StudentOnboardingProfileData = Pick<
  typeof students.$inferInsert,
  'birthDate' | 'job' | 'hobbies'
>;

export interface CompleteStudentOnboardingData extends CompleteOnboardingData {
  student: StudentOnboardingProfileData;
}
