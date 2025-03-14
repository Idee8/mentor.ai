'use client';

import { Clock1, Link } from 'lucide-react';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';

import History from '@/components/history';
import { SearchList } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, fetcher } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { ChatShare, type VisibilityType } from './chat-share';
import { Button } from './ui/button';
import { BASE_URL } from '@/lib/constants';
import useSWR from 'swr';
import type { Chat } from '@/db/schema';
import { useSession } from '@/lib/auth-client';

export const ChatHeader: React.FC<{ id: string }> = ({ id }) => {
  const [openHistory, setOpenHistory] = useState(false);
  const scrolled = useScroll(50);
  const { data: chat, isLoading } = useSWR<Chat>(`/api/chat/${id}`, fetcher);

  if (isLoading || !chat) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex justify-between z-50 items-center border-b border-border p-4 sticky top-0',
        scrolled ? 'bg-background/70 backdrop-blur' : '',
      )}
    >
      <ChatHistory openHistory={openHistory} setOpenHistory={setOpenHistory} />
      <ChatHeaderInfo createdAt={chat.createdAt} title={chat.title} />
      <div className="flex justify-end gap-4 px-4 items-center text-neutral-300">
        <ChatHeaderVisibility id={chat.id} visibility={chat.visibility} />
        {openHistory && <History open={openHistory} setOpen={setOpenHistory} />}
      </div>
    </div>
  );
};

const ChatHeaderInfo: React.FC<{ title: string; createdAt: Date }> = ({
  createdAt,
  title,
}) => {
  const dt = useMemo(() => new Date(createdAt), [createdAt]);

  return (
    <>
      <div className="flex gap-3 items-center text-neutral-400">
        <Clock1 className="h-4 w-4" />
        <p className="text-sm">{format(dt, 'MMM, dd yyyy')}</p>
      </div>
      <div>
        <p>{title}</p>
      </div>
    </>
  );
};

const ChatHeaderVisibility: React.FC<{
  id: string;
  visibility: VisibilityType;
}> = ({ id, visibility }) => {
  const [, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        toast(`Copied to clipboard`, { duration: 1000 });
      })
      .catch((error) => {
        console.error('Failed to copy!', error);
        toast('Failed to copy link');
      });
  };

  return (
    <>
      {visibility === 'public' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'sm'} onClick={handleCopy(`${BASE_URL}/chat/${id}`)}>
              <Link />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Link</TooltipContent>
        </Tooltip>
      )}
      <ChatShare chatId={id} selectedVisibilityType={visibility} />
    </>
  );
};

const ChatHistory: React.FC<{
  openHistory: boolean;
  setOpenHistory: Dispatch<SetStateAction<boolean>>;
}> = ({ setOpenHistory, openHistory }) => {
  const { data, isPending } = useSession();
  if (!data || isPending) {
    return null;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SearchList
          className={cn('cursor-pointer')}
          onClick={() => setOpenHistory(!openHistory)}
        />
      </TooltipTrigger>
      <TooltipContent>History</TooltipContent>
    </Tooltip>
  );
};
