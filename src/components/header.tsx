'use client';

import History from '@/components/history';
import { SearchList, TimerIcon } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const Header: React.FC = () => {
  const [openHistory, setOpenHistory] = useState(false);
  return (
    <div className="flex w-full justify-end gap-4 p-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <TimerIcon className={cn('cursor-pointer')} />
        </TooltipTrigger>
        <TooltipContent>Switch to temporary chat</TooltipContent>
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
      {openHistory && <History open={openHistory} setOpen={setOpenHistory} />}
    </div>
  );
};
