import {
  createDataStreamResponse,
  generateObject,
  type JSONValue,
  type Message,
  NoSuchToolError,
  smoothStream,
  streamText,
} from 'ai';
import { geolocation } from '@vercel/functions';

import * as tools from '@/ai/tools';
import { myProvider } from '@/ai/models';
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
import { getGroupConfig, type MentorGroupId } from '@/ai/groups';

export async function POST(request: Request) {
  const {
    id,
    messages,
    group,
    selectedChatModel,
    selectedFilePathnames,
  }: {
    id: string;
    messages: Array<Message>;
    selectedChatModel: string;
    group: MentorGroupId;
    selectedFilePathnames: Record<string, JSONValue>;
  } = await request.json();
  const {
    tools: activeTools,
    systemPrompt,
    toolInstructions,
    responseGuidelines,
  } = await getGroupConfig(group);
  const geo = geolocation(request);

  console.log('Running with model: ', selectedChatModel.trim());
  console.log('Group: ', group);

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

  if (group !== 'chat' && group !== 'brain') {
    console.log('Running inside part 1');

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: toolInstructions,
          messages,
          toolChoice: 'required',
          maxSteps: 5,
          experimental_activeTools: [...activeTools],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            academicSearch: tools.academicSearch,
            youtubeSearch: tools.youtubeSearch,
            datetime: tools.datetime(geo),
          },
          providerOptions: {
            files: selectedFilePathnames,
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
  } else {
    console.log(`Running inside part 2 in ${group} Group`);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt,
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning' || group === 'chat'
              ? []
              : ['getWeather', 'memoryManager'],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather: tools.getWeather,
            memoryManager: tools.memoryManager(id),
          },
          providerOptions: {
            files: selectedFilePathnames,
          },
          experimental_repairToolCall: async ({
            parameterSchema,
            toolCall,
            tools,
            error,
          }) => {
            if (NoSuchToolError.isInstance(error)) {
              return null; // do not attempt to fix invalid tool names
            }

            console.log('Fixing tool call================================');
            console.log('toolCall', toolCall);
            console.log('tools', tools);
            console.log('parameterSchema', parameterSchema);
            console.log('error', error);

            const tool = tools[toolCall.toolName as keyof typeof tools];

            const { object: repairedArgs } = await generateObject({
              model: myProvider.languageModel('chat-model-google-small'),
              schema: tool.parameters as any,
              prompt: [
                `The model tried to call the tool "${toolCall.toolName}" with the following arguments:`,
                JSON.stringify(toolCall.args),
                `The tool accepts the following schema:`,
                JSON.stringify(parameterSchema(toolCall)),
                'Please fix the arguments.',
                `Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
              ].join('\n'),
            });

            console.log('repairedArgs', repairedArgs);

            return { ...toolCall, args: JSON.stringify(repairedArgs) };
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
          onChunk(event) {
            if (event.chunk.type === 'tool-call') {
              console.log('Called Tool: ', event.chunk.toolName);
            }
          },
          onStepFinish(event) {
            if (event.warnings) {
              console.log('Warnings: ', event.warnings);
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
