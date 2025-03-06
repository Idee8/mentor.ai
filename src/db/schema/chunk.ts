import { index, pgTable, text, vector } from 'drizzle-orm/pg-core';

export const chunk = pgTable(
  'chunks',
  {
    id: text('id').primaryKey().notNull(),
    filePath: text('file_path').notNull(),
    content: text('content').notNull(),
    embeddings: vector('embedding', { dimensions: 768 }).notNull(),
  },
  (table) => [
    index('embeddingIndex').using(
      'hnsw',
      table.embeddings.op('vector_cosine_ops'),
    ),
  ],
);
