import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { generateUUID } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/ai/models';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelFromCookie = cookieStore.get('chat-model');

  const authSession = await auth.api.getSession({ headers: await headers() });

  if (!authSession || !authSession.user) {
    redirect('/');
  }

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
