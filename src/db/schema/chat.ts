import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import type { InferSelectModel } from 'drizzle-orm';

export const chat = pgTable('chats', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').notNull(),
  title: text('title').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;
