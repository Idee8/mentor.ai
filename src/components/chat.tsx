'use client';

import type { Attachment, Message } from 'ai';
import { useChat, type UseChatOptions } from '@ai-sdk/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';

import type { Vote } from '@/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { ChatForm } from './chat-form';
import type { VisibilityType } from './chat-share';
import { Messages } from './messages';
import { ChatHeader } from './chat-header';
import { Header } from './header';
import { useAppContext } from '@/app/providers';
import { suggestQuestions } from '@/app/actions';
import { AnimatePresence } from 'motion/react';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { selectedFilePathnames } = useAppContext();
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const lastSubmittedQueryRef = useRef('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const chatOptions: UseChatOptions = useMemo(
    () => ({
      id,
      body: {
        id,
        selectedChatModel: selectedChatModel,
        selectedFilePathnames: selectedFilePathnames,
      },
      initialMessages,
      experimental_throttle: 500,
      sendExtraMessageFields: true,
      generateId: generateUUID,
      onFinish: async (message, { finishReason }) => {
        setHasSubmitted(true);
        mutate('/api/history');
        console.log('[finish reason]:', finishReason);
        if (
          message.content &&
          (finishReason === 'stop' || finishReason === 'length')
        ) {
          const newHistory = [
            { role: 'user', content: lastSubmittedQueryRef.current },
            { role: 'assistant', content: message.content },
          ];
          const { questions } = await suggestQuestions(newHistory);
          setSuggestedQuestions(questions);
        }
      },
      onError: (error) => {
        console.error('Chat error:', error.cause, error.message);
        toast.error('An error occurred.', {
          description: `Oops! An error occurred while processing your request. ${error.message}`,
        });
      },
    }),
    [id, selectedChatModel, selectedFilePathnames],
  );

  const {
    messages,
    setMessages,
    handleSubmit,
    handleInputChange,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat(chatOptions);

  const resetSuggestedQuestions = useCallback(() => {
    setSuggestedQuestions([]);
  }, []);

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      {messages.length > 0 && <ChatHeader id={id} />}
      {messages.length === 0 && <Header />}
      <div className="relative px-6 mb-6 md:mb-0 pb-36 md:pb-48 w-[768px] max-w-full h-full mx-auto flex flex-col space-y-3 md:space-y-4">
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          input={input}
          setInput={setInput}
          append={append}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          setSuggestedQuestions={setSuggestedQuestions}
          suggestedQuestions={suggestedQuestions}
          lastSubmittedQueryRef={lastSubmittedQueryRef}
        />
        <AnimatePresence>
          {!isReadonly && (
            <ChatForm
              chatId={id}
              status={status}
              input={input}
              setInput={setInput}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              selectedModelId={selectedChatModel}
              lastSubmittedQueryRef={lastSubmittedQueryRef}
              setHasSubmitted={setHasSubmitted}
              resetSuggestedQuestions={resetSuggestedQuestions}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
