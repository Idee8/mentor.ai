'use client';

import { ChatForm } from '@/components/chat-form';
import { generateUUID } from '@/lib/utils';
import { type Message, useChat } from '@ai-sdk/react';
import type { Attachment } from 'ai';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

export const Form: React.FC<{
  id: string;
  selectedChatModel: string;
  initialMessages: Array<Message>;
}> = ({ selectedChatModel, initialMessages, id }) => {
  const { mutate } = useSWRConfig();
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
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

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
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
  );
};
