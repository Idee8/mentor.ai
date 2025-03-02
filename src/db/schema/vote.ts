import type { InferSelectModel } from 'drizzle-orm';
import { boolean, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { chat } from './chat';
import { message } from './message';

export const vote = pgTable(
  'votes',
  {
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('message_id')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('is_upvoted').notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk', columns: [table.chatId, table.messageId] }),
  ],
);

export type Vote = InferSelectModel<typeof vote>;
