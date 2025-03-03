import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Chat } from "@/components/chat";
import { getChatById, getMessagesByChatId } from "@/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { DEFAULT_CHAT_MODEL } from "@/ai/models";
import { ChatPageProvider } from "@/components/chat-provider";
import { DataStreamHandler } from "@/components/data-stream-handler";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage(props: Props) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  if (!chatModelFromCookie) {
    return (
      <ChatPageProvider chat={chat}>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={chat.visibility}
        />
        <DataStreamHandler id={id} />
      </ChatPageProvider>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={chat.visibility}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
