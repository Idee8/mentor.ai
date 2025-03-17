import type { Vote } from '@/db/schema';
import type { ChatRequestOptions, CreateMessage, Message } from 'ai';
import React, {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as motion from 'motion/react-client';
import equal from 'fast-deep-equal';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { AlignLeft, ArrowRight, Copy, PencilRuler, X } from 'lucide-react';
import { Separator } from './ui/separator';
import { type MessagePart, renderPart } from './render-part';
import { deleteTrailingMessages } from '@/app/(main)/actions';

interface MessagesProps {
  chatId: string;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  input: string;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  suggestedQuestions: string[];
  setSuggestedQuestions: Dispatch<SetStateAction<string[]>>;
  lastSubmittedQueryRef: RefObject<string>;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

function PureMessages({
  messages,
  reload,
  setMessages,
  input,
  status,
  append,
  setInput,
  setSuggestedQuestions,
  lastSubmittedQueryRef,
  suggestedQuestions,
}: MessagesProps) {
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
  const [hasManuallyScrolled, setHasManuallyScrolled] = useState(false);
  const isAutoScrollingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastUserMessageIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return i;
      }
    }
    return -1;
  }, [messages]);

  useEffect(() => {
    // Reset manual scroll when streaming starts
    if (status === 'streaming') {
      setHasManuallyScrolled(false);
      // Initial scroll to bottom when streaming starts
      if (bottomRef.current) {
        isAutoScrollingRef.current = true;
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear any pending timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // If we're not auto-scrolling and we're streaming, it must be a user scroll
      if (!isAutoScrollingRef.current && status === 'streaming') {
        const isAtBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100;
        if (!isAtBottom) {
          setHasManuallyScrolled(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Auto-scroll on new content if we haven't manually scrolled
    if (status === 'streaming' && !hasManuallyScrolled && bottomRef.current) {
      scrollTimeout = setTimeout(() => {
        isAutoScrollingRef.current = true;
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Reset auto-scroll flag after animation
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 100);
      }, 100);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [messages, status, hasManuallyScrolled]);

  const handleMessageEdit = useCallback(
    (index: number) => {
      setIsEditingMessage(true);
      setEditingMessageIndex(index);
      setInput(messages[index].content);
    },
    [messages, setInput],
  );

  const handleSuggestedQuestionClick = useCallback(
    async (question: string) => {
      setSuggestedQuestions([]);

      await append({
        content: question.trim(),
        role: 'user',
      });
    },
    [append],
  );

  const handleMessageUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        // Create new messages array up to the edited message
        const newMessages = messages.slice(0, editingMessageIndex + 1);
        // Update the edited message
        newMessages[editingMessageIndex] = {
          ...newMessages[editingMessageIndex],
          content: input.trim(),
        };

        const lastUserMessage = messages.findLast((m) => m.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message
        await deleteTrailingMessages({
          id: lastUserMessage.id,
        });

        // Set the new messages array
        setMessages(newMessages);
        // Reset editing state
        setIsEditingMessage(false);
        setEditingMessageIndex(-1);
        // Store the edited message for reference
        lastSubmittedQueryRef.current = input.trim();

        // Clear input
        setInput('');
        // Reset suggested questions
        setSuggestedQuestions([]);
        // Trigger a new chat completion without appending
        reload();
      } else {
        toast.error('Please enter a valid message.');
      }
    },
    [input, messages, editingMessageIndex, setMessages, setInput, reload],
  );

  const memoizedMessages = useMemo(() => {
    // Create a shallow copy
    const msgs = [...messages];

    return msgs.filter((message) => {
      // Keep all user messages
      if (message.role === 'user') return true;

      // For assistant messages
      if (message.role === 'assistant') {
        // Keep messages that have tool invocations
        if (message.parts?.some((part) => part.type === 'tool-invocation')) {
          return true;
        }
        // Keep messages that have text parts but no tool invocations
        if (
          message.parts?.some((part) => part.type === 'text') ||
          !message.parts?.some((part) => part.type === 'tool-invocation')
        ) {
          return true;
        }
        return false;
      }
      return false;
    });
  }, [messages]);

  const handleRegenerate = useCallback(async () => {
    if (status !== 'ready') {
      toast.error('Please wait for the current response to complete!');
      return;
    }

    const lastUserMessage = messages.findLast((m) => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message
    await deleteTrailingMessages({
      id: lastUserMessage.id,
    });

    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);
    setSuggestedQuestions([]);

    // Resubmit the last user message
    await reload();
  }, [status, messages, setMessages, reload]);

  return (
    <div className="flex flex-col py-4 space-y-4">
      {messages.length === 0 && null}

      {memoizedMessages.map((message, index) => (
        <div
          key={message.id}
          className={`${
            // Add border only if this is an assistant message AND there's a next message
            message.role === 'assistant' && index < memoizedMessages.length - 1
              ? '!mb-12 border-b border-neutral-800 pb-4'
              : ''
          }`.trim()}
        >
          {message.role === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 px-0"
            >
              <div className="flex-grow min-w-0">
                {isEditingMessage && editingMessageIndex === index ? (
                  <form onSubmit={handleMessageUpdate} className="w-full">
                    <div className="bg-neutral-900 rounded-xl border border-neutral-800">
                      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                        <span className="text-sm font-medium text-neutral-400">
                          Edit Message
                        </span>
                        <div className="bg-neutral-800 rounded-[9px] border border-neutral-700 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setIsEditingMessage(false);
                              setEditingMessageIndex(-1);
                              setInput('');
                            }}
                            className="h-7 w-7 !rounded-l-lg !rounded-r-none text-neutral-500 dark:text-neutral-400 hover:text-primary"
                            disabled={
                              status === 'submitted' || status === 'streaming'
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Separator
                            orientation="vertical"
                            className="h-7 bg-neutral-700"
                          />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 !rounded-r-lg !rounded-l-none text-neutral-500 dark:text-neutral-400 hover:text-primary"
                            disabled={
                              status === 'submitted' || status === 'streaming'
                            }
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-base text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Edit your message..."
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="group relative">
                    <div className="relative">
                      <p className="text-xl font-medium font-sans break-words text-neutral-100 pr-10 pb-2 sm:pr-12">
                        {message.content}
                      </p>
                      {!isEditingMessage && index === lastUserMessageIndex && (
                        <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity border-neutral-700 flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMessageEdit(index)}
                            className="h-7 w-7 !rounded-l-lg !rounded-r-none text-neutral-500 dark:text-neutral-400 hover:text-primary"
                            disabled={
                              status === 'submitted' || status === 'streaming'
                            }
                          >
                            <PencilRuler className="h-4 w-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-7" />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                              toast.success('Copied to clipboard');
                            }}
                            className="h-7 w-7 !rounded-r-lg !rounded-l-none text-neutral-400 hover:text-primary"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {message.role === 'assistant' && (
            <>
              {message.parts?.map((part, partIndex) =>
                renderPart({
                  part,
                  messageIndex: index,
                  partIndex,
                  parts: message.parts as MessagePart[],
                  message,
                  status,
                  handleRegenerate,
                }),
              )}

              {/* Add suggested questions if this is the last message and it's from the assistant */}
              {index === memoizedMessages.length - 1 &&
                suggestedQuestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl sm:max-w-2xl mt-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlignLeft className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-base text-neutral-200">
                        Suggested questions
                      </h2>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-fit font-medium rounded-2xl p-1 justify-start text-left h-auto py-2 px-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 whitespace-normal"
                          onClick={() => handleSuggestedQuestionClick(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
            </>
          )}
        </div>
      ))}
      <div ref={bottomRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.messages !== nextProps.messages) return false;
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.lastSubmittedQueryRef !== nextProps.lastSubmittedQueryRef)
    return false;
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
