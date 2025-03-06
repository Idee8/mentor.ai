'use client';

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  memo,
} from 'react';
import { useWindowSize } from 'usehooks-ts';

import { cn } from '@/lib/utils';

import equal from 'fast-deep-equal';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowUp, MessageCirclePlus, Square } from 'lucide-react';
import { FileScript, Github } from './icons';
import { AnimatePresence } from 'motion/react';
import { Files } from './files-modal';
import { useAppContext } from '@/app/providers';

export interface ChatFormProps {
  chatId: string;
  input?: string;
  setInput?: (value: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading?: boolean;
  stop?: () => void;
  attachments?: Array<Attachment>;
  setAttachments?: Dispatch<SetStateAction<Array<Attachment>>>;
  messages?: Array<Message>;
  setMessages?: Dispatch<SetStateAction<Array<Message>>>;
  append?: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit?: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
  selectedModelId: string;
}

function PureChatForm({
  chatId,
  input = '',
  setInput = () => {},
  isLoading = false,
  stop = () => {},
  attachments = [],
  handleInputChange,
  setAttachments = () => {},
  messages = [],
  setMessages = () => {},
  append = async () => null,
  handleSubmit = () => {},
  className,
  selectedModelId,
}: ChatFormProps) {
  const pathname = usePathname();
  const { setSelectedFilePathnames, selectedFilePathnames } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [isComposing, setIsComposing] = useState(false); // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false); // Disable Enter after composition ends
  const [isFilesVisible, setIsFilesVisible] = useState(false);

  const handleCompositionStart = () => setIsComposing(true);

  const handleCompositionEnd = () => {
    setIsComposing(false);
    setEnterDisabled(true);
    setTimeout(() => {
      setEnterDisabled(false);
    }, 300);
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  };

  const submitForm = useCallback(() => {
    // Only update the URL without full navigation
    if (pathname !== `/chat/${chatId}`) {
      window.history.pushState({}, '', `/chat/${chatId}`);
    }

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width, chatId, pathname]);

  return (
    <div
      className={cn(
        messages.length > 0
          ? 'w-[45rem] max-w-full bg-background flex flex-col items-center fixed bottom-0 -translate-x-[1.5rem] md:translate-x-0 h-fit px-4 md:px-[unset] pb-1 md:max-w-[calc(100%-3rem-var(--sidebar-width))]'
          : 'flex flex-col items-center justify-center w-full h-full mx-auto',
      )}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 mb-0 md:mb-6 space-y-4">
          <h1 className="text-3xl font-medium animate-fade-down">
            How can I help you today?
          </h1>
        </div>
      )}
      <form
        className={cn(
          'max-w-3xl w-full mx-auto relative rounded-3xl p-2',
          messages.length > 0 ? 'p-2' : 'px-6',
        )}
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            submitForm();
          }
        }}
      >
        <div className="relative flex flex-col w-full gap-2 bg-neutral-900 rounded-3xl border border-neutral-900 ring-2 ring-neutral-900 ring-inset overflow-hidden @container/input hover:ring-card-border-focus hover:bg-input-hover focus-within:ring-1 focus-within:ring-input-border-focus hover:focus-within:ring-input-border-focus pt-2 px-2 @[480px]/input:px-3">
          <textarea
            ref={textareaRef}
            name="input"
            rows={2}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Ask a question..."
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 bg-transparent border-0 px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              handleInputChange?.(e);
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !isComposing &&
                !enterDisabled
              ) {
                if (input.trim().length === 0) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                textarea.form?.requestSubmit();
              }
            }}
          />

          {/* Bottom menu area */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Button
                type={'button'}
                size={'icon'}
                variant={'outline'}
                className={'rounded-full'}
                onClick={() => {}}
              >
                <Github />
              </Button>
              <Button
                type={'button'}
                size={'icon'}
                variant={'outline'}
                className={'rounded-full'}
                onClick={() => {
                  setIsFilesVisible(!isFilesVisible);
                }}
              >
                <FileScript className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={submitForm}
                  className="shrink-0 rounded-full group"
                  type="button"
                  disabled={isLoading}
                >
                  <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
                </Button>
              )}
              <Button
                type={isLoading ? 'button' : 'submit'}
                size={'icon'}
                variant={'outline'}
                className={cn(isLoading && 'animate-pulse', 'rounded-full')}
                disabled={input.length === 0 && !isLoading}
                onClick={isLoading ? stop : undefined}
              >
                {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <AnimatePresence>
        {isFilesVisible && (
          <Files
            setIsFilesVisible={setIsFilesVisible}
            selectedFilePathnames={selectedFilePathnames}
            setSelectedFilePathnames={setSelectedFilePathnames}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export const ChatForm = memo(PureChatForm, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (!equal(prevProps.attachments, nextProps.attachments)) return false;

  return true;
});
