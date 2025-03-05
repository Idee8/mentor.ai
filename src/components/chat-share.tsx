'use client';

import { GlobeIcon, LockIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { type ReactNode, useMemo, useState } from 'react';
import { useChatVisibility } from '@/hooks/use-chat-visibility';

const visibilities: Array<{
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    id: 'private',
    label: 'Private',
    description: 'Only you can access this chat',
    icon: <LockIcon className="h-4 w-4" />,
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone with the link can access this chat',
    icon: <GlobeIcon className="h-4 w-4" />,
  },
];

export type VisibilityType = 'private' | 'public';

export const ChatShare: React.FC<{
  chatId: string;
  selectedVisibilityType: VisibilityType;
}> = ({ chatId, selectedVisibilityType }) => {
  const [open, setOpen] = useState(false);

  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId,
    initialVisibility: selectedVisibilityType,
  });

  const selectedVisibility = useMemo(
    () => visibilities.find((visibility) => visibility.id === visibilityType),
    [visibilityType],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Button size={'sm'} className="rounded-full">
          {selectedVisibility?.label}
          {selectedVisibility?.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] max-w-full mr-4 mt-2">
        <DropdownMenuLabel>View Access</DropdownMenuLabel>
        <div className="border border-border divide-y-2 mx-2 my-4">
          {visibilities.map((visibility) => (
            <div
              className="w-full px-2 py-1.5 cursor-pointer hover:bg-muted"
              key={visibility.id}
              onClick={() => {
                setVisibilityType(visibility.id);
                setOpen(false);
              }}
            >
              <span className="flex gap-2 items-center text-sm">
                {visibility.icon}
                {visibility.label}
              </span>
              <span className="text-neutral-300 text-xs">
                {visibility.description}
              </span>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
