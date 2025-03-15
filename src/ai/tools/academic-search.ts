import { tool } from 'ai';
import { z } from 'zod';
import Exa from 'exa-js';

export const academicSearch = tool({
  description: 'Search academic papers and research.',
  parameters: z.object({
    query: z.string().describe('The search query'),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const exa = new Exa(process.env.EXA_API_KEY as string);

      // Search academic papers with content summary
      const result = await exa.searchAndContents(query, {
        type: 'auto',
        numResults: 20,
        category: 'research paper',
        summary: {
          query: 'Abstract of the Paper',
        },
      });

      // Process and clean results
      const processedResults = result.results.reduce<typeof result.results>(
        (acc, paper) => {
          // Skip if URL already exists or if no summary available
          if (acc.some((p) => p.url === paper.url) || !paper.summary)
            return acc;

          // Clean up summary (remove "Summary:" prefix if exists)
          const cleanSummary = paper.summary.replace(/^Summary:\s*/i, '');

          // Clean up title (remove [...] suffixes)
          const cleanTitle = paper.title?.replace(/\s\[.*?\]$/, '');

          acc.push({
            ...paper,
            title: cleanTitle || '',
            summary: cleanSummary,
          });

          return acc;
        },
        [],
      );

      // Take only the first 10 unique, valid results
      const limitedResults = processedResults.slice(0, 10);

      return {
        results: limitedResults,
      };
    } catch (error) {
      console.error('Academic search error:', error);
      throw error;
    }
  },
});
