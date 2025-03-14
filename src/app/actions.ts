'use server';

import { myProvider } from '@/ai/models';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const html = await response.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i,
    );

    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';

    return { title, description };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

export async function suggestQuestions(history: any[]) {
  'use server';

  console.log(history);

  const { object } = await generateObject({
    model: myProvider.languageModel('chat-model-google-large'),
    temperature: 0,
    maxTokens: 300,
    topP: 0.3,
    topK: 7,
    system: `You are a search engine query/questions generator. You 'have' to create only '3' questions for the search engine based on the message history which has been provided to you.
  The questions should be open-ended and should encourage further discussion while maintaining the whole context. Limit it to 5-10 words per question.
  Always put the user input's context is some way so that the next search knows what to search for exactly.
  Try to stick to the context of the conversation and avoid asking questions that are too general or too specific.
  For weather based conversations sent to you, always generate questions that are about news, sports, or other topics that are not related to the weather.
  For programming based conversations, always generate questions that are about the algorithms, data structures, or other topics that are related to it or an improvement of the question.
  For location based conversations, always generate questions that are about the culture, history, or other topics that are related to the location.
  Do not use pronouns like he, she, him, his, her, etc. in the questions as they blur the context. Always use the proper nouns from the context.`,
    messages: history,
    schema: z.object({
      questions: z
        .array(z.string())
        .describe('The generated questions based on the message history.'),
    }),
  });

  return {
    questions: object.questions,
  };
}
