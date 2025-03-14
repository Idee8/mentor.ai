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
  type RefObject,
  memo,
} from 'react';
import { useWindowSize } from 'usehooks-ts';
import { ArrowUp } from 'lucide-react';
import * as motion from 'motion/react-client';
import equal from 'fast-deep-equal';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { FileScript, Github } from './icons';
import { AnimatePresence } from 'motion/react';
import { Files } from './files-modal';
import { useAppContext } from '@/app/providers';
import { mentorGroup, type MentorGroup, type MentorGroupId } from '@/ai/groups';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface SelectionContentProps {
  selectedGroup: MentorGroupId;
  onGroupSelect: (group: MentorGroup) => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  onExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface GroupSelectorProps {
  selectedGroup: MentorGroupId;
  onGroupSelect: (group: MentorGroup) => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  onExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ToolbarButtonProps {
  group: MentorGroup;
  isSelected: boolean;
  onClick: () => void;
}

const ToolbarButton = ({ group, isSelected, onClick }: ToolbarButtonProps) => {
  const Icon = group.icon as any;
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const commonClassNames = cn(
    'relative flex items-center justify-center',
    'size-8',
    'rounded-full',
    'transition-colors duration-300',
    isSelected
      ? 'bg-background text-neutral-300'
      : 'text-neutral-300 hover:bg-accent',
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  // Use regular button for mobile
  if (isMobile) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={commonClassNames}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Icon className="size-4" />
      </button>
    );
  }

  // Use motion.button for desktop
  const button = (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={commonClassNames}
    >
      <Icon className="size-4" />
    </motion.button>
  );

  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={6}
        className={cn(
          'z-[100]',
          'w-44 p-2 rounded-lg',
          'border border-neutral-700',
          'bg-neutral-800 shadow-md',
          'transition-opacity duration-300',
        )}
      >
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium text-neutral-100">{group.name}</h4>
          <p className="text-xs text-neutral-400 leading-normal">
            {group.description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const SelectionContent = ({
  onGroupSelect,
  selectedGroup,
  status,
  onExpandChange,
}: SelectionContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isProcessing = status === 'submitted' || status === 'streaming';
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  // Notify parent component when expansion state changes
  useEffect(() => {
    if (onExpandChange) {
      // Only notify about expansion on mobile devices
      onExpandChange(isMobile ? isExpanded : false);
    }
  }, [isExpanded, onExpandChange, isMobile]);

  return (
    <motion.div
      layout={false}
      initial={false}
      animate={{
        width: isExpanded && !isProcessing ? 'auto' : '30px',
        gap: isExpanded && !isProcessing ? '0.5rem' : 0,
        paddingRight: isExpanded && !isProcessing ? '0.25rem' : 0,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'inline-flex items-center min-w-[38px] p-0.5',
        'rounded-full border border-neutral-800',
        'bg-neutral-900 shadow-sm overflow-visible',
        'relative z-10',
        isProcessing && 'opacity-50 pointer-events-none',
      )}
      onMouseEnter={() => !isProcessing && setIsExpanded(true)}
      onMouseLeave={() => !isProcessing && setIsExpanded(false)}
    >
      <AnimatePresence initial={false}>
        {mentorGroup
          .filter((group) => group.show)
          .map((group, index, filteredGorups) => {
            const showItem =
              (isExpanded && !isProcessing) || selectedGroup === group.id;
            const isLastItem = index === filteredGorups.length - 1;

            return (
              <motion.div
                key={group.id}
                layout={false}
                animate={{
                  width: showItem ? '28px' : 0,
                  opacity: showItem ? 1 : 0,
                  marginRight: showItem && isLastItem && isExpanded ? '2px' : 0,
                }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className={cn(
                  isLastItem && isExpanded && showItem ? 'pr-0.5' : '',
                )}
                style={{ margin: 0 }}
              >
                <ToolbarButton
                  group={group}
                  isSelected={selectedGroup === group.id}
                  onClick={() => !isProcessing && onGroupSelect(group)}
                />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
};

const GroupSelector = ({
  selectedGroup,
  onGroupSelect,
  status,
  onExpandChange,
}: GroupSelectorProps) => {
  return (
    <SelectionContent
      selectedGroup={selectedGroup}
      onGroupSelect={onGroupSelect}
      status={status}
      onExpandChange={onExpandChange}
    />
  );
};

const StopIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
      />
    </svg>
  );
};

export interface ChatFormProps {
  chatId: string;
  input?: string;
  setInput?: (value: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  selectedModelId: string;
  selectedGroup: MentorGroupId;
  lastSubmittedQueryRef: RefObject<string>;
  resetSuggestedQuestions: () => void;
  setHasSubmitted: Dispatch<SetStateAction<boolean>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<MentorGroupId>>;
}

function PureChatForm({
  chatId,
  selectedGroup,
  setSelectedGroup,
  input = '',
  setInput = () => {},
  status,
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
  lastSubmittedQueryRef,
  setHasSubmitted,
  resetSuggestedQuestions,
}: ChatFormProps) {
  const pathname = usePathname();
  const { setSelectedFilePathnames, selectedFilePathnames } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false); // Disable Enter after composition ends
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isGroupSelectorExpanded, setIsGroupSelectorExpanded] = useState(false);

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

  const handleGroupSelect = useCallback(
    (group: MentorGroup) => {
      setSelectedGroup(group.id);
      textareaRef.current?.focus();
    },
    [setSelectedGroup, textareaRef],
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
    resetSuggestedQuestions();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width, chatId, pathname]);

  const isProcessing = status === 'submitted' || status === 'streaming';
  const isMobile = width ? width < 768 : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
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
          'max-w-3xl w-full mx-auto relative rounded-3xl',
          messages.length > 0 ? '' : 'px-6',
        )}
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            submitForm();
          }
        }}
      >
        <div className="relative flex flex-col w-full gap-2 bg-neutral-900/80 rounded-lg border border-neutral-900 ring-2 ring-neutral-900 ring-inset overflow-hidden @container/input hover:ring-card-border-focus hover:bg-input-hover focus-within:ring-1 focus-within:ring-input-border-focus hover:focus-within:ring-input-border-focus pt-2 px-2 @[480px]/input:px-3">
          <textarea
            ref={textareaRef}
            name="input"
            rows={2}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
              <div
                className={cn(
                  'absolute bottom-0 inset-x-0 flex justify-between items-center p-2 rounded-b-lg',
                  isProcessing ? '!opacity-20 !cursor-not-allowed' : '',
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isMobile && 'overflow-hidden',
                  )}
                >
                  <div
                    className={cn(
                      'transition-all duration-100 opacity-100 visible w-auto',
                    )}
                  >
                    <GroupSelector
                      selectedGroup={selectedGroup}
                      onGroupSelect={handleGroupSelect}
                      status={status}
                      onExpandChange={setIsGroupSelectorExpanded}
                    />
                  </div>
                  <Button
                    type={'button'}
                    size={'icon'}
                    variant={'outline'}
                    className={'rounded-full'}
                    disabled={true}
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
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing ? (
                <Button
                  type={'button'}
                  size={'icon'}
                  variant={'destructive'}
                  className={'rounded-full animate-pulse p-1.5 h-8 w-8'}
                  onClick={(event) => {
                    event.preventDefault();
                    stop();
                  }}
                >
                  <StopIcon size={14} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="rounded-full p-1.5 h-8 w-8"
                  variant={'outline'}
                  onClick={(event) => {
                    event.preventDefault();
                    submitForm();
                  }}
                  disabled={
                    (input.length === 0 && attachments.length === 0) ||
                    status !== 'ready'
                  }
                >
                  <ArrowUp />
                </Button>
              )}
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
    </motion.div>
  );
}

export const ChatForm = memo(PureChatForm, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.lastSubmittedQueryRef !== nextProps.lastSubmittedQueryRef)
    return false;
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;
  if (!equal(prevProps.attachments, nextProps.attachments)) return false;

  return true;
});
