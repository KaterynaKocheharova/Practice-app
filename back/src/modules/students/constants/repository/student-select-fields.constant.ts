import { users } from '../../../users/schemas/schema';
import { students } from '../../schemas/schema';

export const studentCardSelectFields = {
  id: students.userId,
  name: users.name,
  job: students.job,
  hobbies: students.hobbies,
};

export const studentDetailsSelectFields = {
  id: students.userId,
  name: users.name,
  email: users.email,
  birthDate: students.birthDate,
  job: students.job,
  hobbies: students.hobbies,
  status: users.status,
};
