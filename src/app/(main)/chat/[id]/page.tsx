import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/db/queries';
import { convertToUIMessages } from '@/lib/utils';
import { DEFAULT_CHAT_MODEL } from '@/ai/models';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '@/lib/auth';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const chat = await getChatById({ id });

  if (!chat) {
    return notFound();
  }

  return {
    title: chat?.title.toString().slice(0, 50) || 'Mentor AI',
  };
}

export default async function ChatPage(props: Props) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });
  const authSession = await auth.api.getSession({ headers: await headers() });

  if (!chat) {
    notFound();
  }

  // protect private chats
  if (chat.visibility === 'private') {
    if (!authSession?.session || !authSession.user) {
      return notFound();
    }

    if (authSession.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={chat.visibility}
          isReadonly={authSession?.user?.id !== chat.userId}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={chat.visibility}
        isReadonly={authSession?.user?.id !== chat.userId}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
