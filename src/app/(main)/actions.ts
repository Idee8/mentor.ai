'use server';

import { myProvider } from '@/ai/models';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
} from '@/db/queries';
import { generateText, type Message } from 'ai';
import { cookies } from 'next/headers';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: { message: Message }) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
        - you will generate a short title based on the first message a user begins a conversations with
        - ensure it is not more than 60 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons
        `,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.id,
    timestamp: message.createdAt,
  });
}
