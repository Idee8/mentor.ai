'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';

import { ChatForm } from './chat-form';
import { toast } from 'sonner';
import type { VisibilityType } from './visibility-selector';
import { useChatContext } from './chat-provider';
import { Messages } from './messages';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
}) {
  const { mutate } = useSWRConfig();
  const { chat, user } = useChatContext();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: (error) => {
      toast.error('An error occured, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader chat={chat} />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={chat.userId !== user?.id}
        />

        <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full">
          {!(chat.userId !== user?.id) && (
            <ChatForm
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </div>
      </div>
    </>
  );
}
