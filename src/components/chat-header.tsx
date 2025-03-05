'use client';

import { Clock1, Link } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import type { Chat } from '@/db/schema';
import { ChatShare } from './chat-share';
import { Button } from './ui/button';
import { BASE_URL } from '@/lib/constants';

export const ChatHeader: React.FC<{ chat: Chat }> = ({ chat }) => {
  const [openHistory, setOpenHistory] = useState(false);
  const scrolled = useScroll(50);

  const dt = useMemo(() => new Date(chat.createdAt), [chat.createdAt]);

  const [, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        toast(`Link Copied: ${text}`, { duration: 1000 });
      })
      .catch((error) => {
        console.error('Failed to copy!', error);
        toast('Failed to copy link');
      });
  };

  return (
    <div
      className={cn(
        'flex justify-between z-50 items-center border-b border-border p-4 sticky top-0',
        scrolled ? 'bg-background/70 backdrop-blur' : '',
      )}
    >
      <div className="flex gap-3 items-center text-neutral-400">
        <Clock1 className="h-4 w-4" />
        <p className="text-sm">{format(dt, 'MMM, dd yyyy')}</p>
      </div>
      <div>
        <p>{chat.title}</p>
      </div>
      <div className="flex justify-end gap-4 px-4 items-center text-neutral-300">
        <Tooltip>
          <TooltipTrigger asChild>
            <SearchList
              className={cn('cursor-pointer')}
              onClick={() => setOpenHistory(!openHistory)}
            />
          </TooltipTrigger>
          <TooltipContent>History</TooltipContent>
        </Tooltip>
        {chat.visibility === 'public' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={'sm'}
                onClick={handleCopy(`${BASE_URL}/chat/${chat.id}`)}
              >
                <Link />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Link</TooltipContent>
          </Tooltip>
        )}
        <ChatShare chatId={chat.id} selectedVisibilityType={chat.visibility} />
        {openHistory && <History open={openHistory} setOpen={setOpenHistory} />}
      </div>
    </div>
  );
};
