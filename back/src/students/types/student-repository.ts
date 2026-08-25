import { LearningGoal } from '../enums';

interface StudentBaseData {
  userId: string;
  hobbies: string[];
  learningGoal: LearningGoal;
  job: string;
  age: number;
}

export interface CreateStudentData extends StudentBaseData {
  teacherId: string;
  specialGoal?: string | null;
}

export interface StudentData extends StudentBaseData {
  teacherId: string | null;
  specialGoal: string | null;
}
