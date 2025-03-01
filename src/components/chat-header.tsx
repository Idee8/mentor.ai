'use client';

import History from '@/components/history';
import { SearchList } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Bookmark, Clock1, MoreHorizontal, Share } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useScroll } from '@/hooks/use-scroll';

export const ChatHeader: React.FC = () => {
  const [openHistory, setOpenHistory] = useState(false);
  const scrolled = useScroll(50);
  return (
    <div
      className={cn(
        'flex justify-between items-center border-b border-border p-4 sticky top-0',
        scrolled ? 'bg-background/70 backdrop-blur' : '',
      )}
    >
      <div className="flex gap-3 items-center text-neutral-400">
        <Clock1 className="h-4 w-4" />
        <p className="text-sm">Feb 28, 2025</p>
      </div>
      <div>
        <p>Why do people want to code?</p>
      </div>
      <div className="flex justify-end gap-4 px-4 items-center text-neutral-300">
        <MoreHorizontal className={cn('cursor-pointer')} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Bookmark className={cn('cursor-pointer')} />
          </TooltipTrigger>
          <TooltipContent>Save to Library</TooltipContent>
        </Tooltip>
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
