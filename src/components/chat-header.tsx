'use client';

import { Clock1, Share } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

import History from '@/components/history';
import { SearchList } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useScroll } from '@/hooks/use-scroll';
import type { Chat } from '@/db/schema';

export const ChatHeader: React.FC<{ chat: Chat }> = ({ chat }) => {
  const [openHistory, setOpenHistory] = useState(false);
  const scrolled = useScroll(50);

  const dt = useMemo(() => new Date(chat.createdAt), [chat.createdAt]);

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
        <Button size={'sm'} className="rounded-full">
          Share
          <Share />
        </Button>
        {openHistory && <History open={openHistory} setOpen={setOpenHistory} />}
      </div>
    </div>
  );
};
