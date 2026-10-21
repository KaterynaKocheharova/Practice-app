import { users } from '../../../users/schemas/schema';
import { students } from '../../schemas/schema';

export const studentCardSelectFields = {
  id: students.userId,
  name: users.name,
  job: students.job,
  hobbies: students.hobbies,
};

export const studentDetailsWithEditAccessSelectFields = {
  id: students.userId,
  name: users.name,
  email: users.email,
  birthDate: students.birthDate,
  job: students.job,
  hobbies: students.hobbies,
  status: users.status,
  createdByTeacherId: students.createdByTeacherId,
};

export const studentIdSelectFields = {
  id: students.userId,
};
