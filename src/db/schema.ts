import { text, varchar, pgTable, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username').unique(),
  password: text('password'),
});
