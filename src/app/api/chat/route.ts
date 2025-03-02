import { myProvider } from '@/ai/models';
import { getWeather } from '@/ai/models/get-weather';
import { systemPrompt } from '@/ai/prompts';
import { generateTitleFromUserMessage } from '@/app/(main)/actions';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/db/queries';
import { auth } from '@/lib/auth';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';
import {
  createDataStreamResponse,
  type Message,
  smoothStream,
  streamText,
} from 'ai';

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: {
    id: string;
    messages: Array<Message>;
    selectedChatModel: string;
  } = await request.json();

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === 'chat-model-reasoning' ? [] : ['getWeather'],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
        },
        onFinish: async ({ response, reasoning }) => {
          if (session.user.id) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                }),
              });
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, { sendReasoning: true });
    },
    onError: () => {
      return 'Oops, an error occurred!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not found', { status: 404 });
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
