import { pgTable, uuid } from 'drizzle-orm/pg-core';

import { users } from '../../users/schemas/schema';

export const teachers = pgTable('teachers', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
});
