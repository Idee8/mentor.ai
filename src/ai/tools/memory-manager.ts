import { tool } from 'ai';
import { z } from 'zod';
import { MemoryClient } from 'mem0ai';

export const memoryManager = (userId: string) =>
  tool({
    description: 'Manage personal memories with add and search operations.',
    parameters: z.object({
      action: z
        .enum(['add', 'search'])
        .describe('The memory operation to perform'),
      content: z
        .string()
        .optional()
        .describe('The memory content for add operation'),
      query: z
        .string()
        .optional()
        .describe('The search query for search operations'),
    }),
    execute: async ({
      action,
      content,
      query,
    }: {
      action: 'add' | 'search';
      content?: string;
      query?: string;
    }) => {
      const client = new MemoryClient({
        apiKey: process.env.MEM0_API_KEY as string,
      });

      console.log('action', action);
      console.log('content', content);
      console.log('query', query);

      try {
        switch (action) {
          case 'add': {
            if (!content) {
              return {
                success: false,
                action: 'add',
                message: 'Content is required for add operation',
              };
            }
            const result = await client.add(content, {
              user_id: userId,
            });
            if (result.length === 0) {
              return {
                success: false,
                action: 'add',
                message: 'No memory added',
              };
            }
            console.log('result', result);
            return {
              success: true,
              action: 'add',
              memory: result[0],
            };
          }
          case 'search': {
            if (!query) {
              return {
                success: false,
                action: 'search',
                message: 'Query is required for search operation',
              };
            }
            const searchFilters = {
              AND: [{ user_id: userId }],
            };
            const result = await client.search(query, {
              filters: searchFilters,
              api_version: 'v2',
            });
            console.log(result);
            if (!result || !result[0]) {
              return {
                success: false,
                action: 'search',
                message: 'No results found for the search query',
              };
            }
            return {
              success: true,
              action: 'search',
              results: result[0],
            };
          }
        }
      } catch (error) {
        console.error('Memory operation error:', error);
        throw error;
      }
    },
  });
