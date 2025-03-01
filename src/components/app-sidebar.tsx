'use client';

import { Hexagon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { createContext, useState, useContext, useEffect } from 'react';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useRouter } from 'next/navigation';

import {
  Astroid,
  CpuIcon,
  DocumentAttachment,
  SidebarLeft,
  SidebarRight,
  Telescope,
} from './icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider } from './ui/tooltip';
import { Avatar } from './ui/avatar';

type SidebarContextType = {
  expanded: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleSidebar: () => {},
});

export const SidebarProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      setExpanded(JSON.parse(savedState));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
  }, [expanded]);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

// Types
type MenuItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
};

// Sidebar Items
const menuItems: MenuItem[] = [
  { icon: <CpuIcon />, label: 'Home', path: '/', active: true },
  { icon: <Telescope />, label: 'Discover', path: '/discover' },
  { icon: <Astroid />, label: 'Spaces', path: '/spaces' },
  { icon: <DocumentAttachment />, label: 'Documents', path: '/documents' },
];

export default function Sidebar() {
  const { expanded, toggleSidebar } = useSidebar();
  const router = useRouter();

  return (
    <div
      className={`
        bg-sidebar flex flex-col transition-all duration-300 ease-in-out border-r border-border
        ${expanded ? 'w-[250px]' : 'items-center w-[80px]'}
      `}
    >
      <div
        className={cn(
          'p-4 flex items-center',
          expanded ? 'justify-between' : 'justify-center',
        )}
      >
        <Link href="/dash" className="flex items-center">
          <div>
            <Hexagon className={cn(expanded ? 'h-7 w-7' : 'h-10 w-10')} />
          </div>
          {expanded && (
            <span className="ml-2 text-xl font-semibold text-white">
              mentor
            </span>
          )}
        </Link>

        {expanded && (
          <SidebarLeft
            onClick={toggleSidebar}
            className="cursor-pointer text-neutral-300"
          />
        )}
      </div>

      <div className="mt-4 px-3">
        {expanded && (
          <button
            onClick={() => router.push('/dash')}
            type="button"
            className="flex w-full items-center gap-2 rounded-3xl border-2 border-border hover:border-primary/60 bg-neutral-950 py-2 px-4 text-sm text-neutral-300"
          >
            <span>New Thread</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl + T</span>
          </button>
        )}
        {!expanded && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={'/dash'}
                className="w-10 h-10 flex justify-center items-center p-2 rounded-full bg-neutral-800"
              >
                <PlusIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Tooltip>
        )}
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.path}
                className={`
                  flex items-center rounded-md px-3 py-2 text-gray-300 hover:bg-sidebar-accent hover:text-white
                  ${item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                `}
              >
                {item.icon}
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-3 pb-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Avatar className="h-8 w-8" />
          {expanded && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm text-gray-300">user2050471...</p>
            </div>
          )}
          {expanded && (
            <button type="button" className="text-gray-400 hover:text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {!expanded && (
          <div className="flex justify-center">
            <SidebarRight
              onClick={toggleSidebar}
              className="cursor-pointer text-neutral-300 h-7 w-7"
            />
          </div>
        )}
      </div>
    </div>
  );
}
