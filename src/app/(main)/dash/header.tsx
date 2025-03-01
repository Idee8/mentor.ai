'use client';

import { SearchList, TimerIcon } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  return (
    <div className="flex w-full justify-end gap-4 px-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <TimerIcon className={cn('cursor-pointer')} />
        </TooltipTrigger>
        <TooltipContent>Switch to temporary chat</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <SearchList className={cn('cursor-pointer')} />
        </TooltipTrigger>
        <TooltipContent>History</TooltipContent>
      </Tooltip>
    </div>
  );
};
