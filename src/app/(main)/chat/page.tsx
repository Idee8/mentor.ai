import { cookies } from 'next/headers';

import { generateUUID } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/ai/models';

export default async function DashboardPage() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelFromCookie = cookieStore.get('chat-model');

  if (!modelFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={id}
        initialMessages={[]}
        isReadonly={false}
        selectedChatModel={modelFromCookie?.value}
        selectedVisibilityType="private"
      />
      <DataStreamHandler id={id} />
    </>
  );
}
