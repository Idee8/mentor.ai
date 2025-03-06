import { getChunksByFilePaths } from '@/db/queries';
import { auth } from '@/lib/auth';
import {
  cosineSimilarity,
  embed,
  generateObject,
  generateText,
  type LanguageModelV1Middleware,
} from 'ai';
import { headers } from 'next/headers';
import { z } from 'zod';
import { myProvider } from './models';

// schema for validating the custom provider metadata
const selectionSchema = z.object({
  files: z.array(z.string()),
});

export const ragMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) return params; // no user session

    const { prompt: messages, providerMetadata } = params;

    // validate the provider metadata with Zod:
    const { success, data } = selectionSchema.safeParse(providerMetadata);

    if (!success) return params; // no files selected

    const selection = data.files;

    const recentMessage = messages.pop();

    if (!recentMessage || recentMessage.role !== 'user') {
      if (recentMessage) {
        messages.push(recentMessage);
      }

      return params;
    }

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === 'text')
      .map((content) => content.text)
      .join('\n');

    // Classify the user prompt as whether it requires more context or not
    const { object: classification } = await generateObject({
      // fast model for classification:
      model: myProvider.languageModel('chat-model-google-small'),
      output: 'enum',
      enum: ['question', 'statement', 'other'],
      system: 'classify the user message as a question, statement, or other',
      prompt: lastUserMessageContent,
    });

    console.log(classification);

    // only use RAG for questions
    if (classification !== 'question') {
      messages.push(recentMessage);
      return params;
    }

    // Use hypothetical document embeddings:
    const { text: hypotheticalAnswer } = await generateText({
      // fast model for generating hypothetical answer:
      model: myProvider.languageModel('chat-model-google-small'),
      system: 'Answer the users question:',
      prompt: lastUserMessageContent,
    });

    // Embed the hypothetical answer
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: myProvider.textEmbeddingModel('google'),
      value: hypotheticalAnswer,
    });

    // find relevant chunks based on the selection
    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${session.user?.email}/${path}`),
    });

    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        hypotheticalAnswerEmbedding,
        chunk.embeddings,
      ),
    }));

    // rank the chunks by similarity and take the top K
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);

    // add the chunks to the last user message
    messages.push({
      role: 'user',
      content: [
        ...recentMessage.content,
        {
          type: 'text',
          text: 'Here is some relevant information that you can use to answer the question:',
        },
        ...topKChunks.map((chunk) => ({
          type: 'text' as const,
          text: chunk.content,
        })),
      ],
    });

    return { ...params, prompt: messages };
  },
};
