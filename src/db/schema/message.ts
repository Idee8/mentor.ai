import { json, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { chat } from './chat';
import type { InferSelectModel } from 'drizzle-orm';

export const message = pgTable('messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export type Message = InferSelectModel<typeof message>;
