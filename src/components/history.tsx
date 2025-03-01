'use client';

import {
  useEffect,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Command } from 'cmdk';
import { Search, Trash, Edit, LogOut } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { FileScript, TimerIcon } from './icons';

type Conversation = {
  id: string;
  title: string;
  timestamp: Date;
};

export default function History({
  open,
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}) {
  const [search, setSearch] = useState('');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(
    null,
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // Simulated conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Bitcoin Performance in Economic Crises',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
      id: '2',
      title: 'Best AI Model Comparison',
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    },
    {
      id: '3',
      title: 'New conversation',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: '4',
      title: 'IoT and Protocols: HTTP, MQTT, RFID Tech',
      timestamp: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000,
      ), // 5 days and 30 minutes ago
    },
    {
      id: '5',
      title: 'VTP: VLAN Management and Optimization',
      timestamp: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000,
      ), // 5 days and 3 hours ago
    },
  ]);

  // Format relative time for display
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Automatically categorize conversations based on timestamp
  const categorizeConversations = (conversations: Conversation[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return conversations.reduce(
      (acc, conversation) => {
        let category = 'Older';
        const conversationDate = new Date(conversation.timestamp);
        conversationDate.setHours(0, 0, 0, 0);

        if (conversationDate.getTime() === today.getTime()) {
          category = 'Today';
        } else if (conversationDate.getTime() === yesterday.getTime()) {
          category = 'Yesterday';
        } else if (conversationDate.getTime() >= oneWeekAgo.getTime()) {
          category = 'Last 7 Days';
        }

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push({
          ...conversation,
          timeAgo: formatTimeAgo(conversation.timestamp),
        });

        return acc;
      },
      {} as Record<string, (Conversation & { timeAgo: string })[]>,
    );
  };

  // Handle keyboard shortcuts (Cmd+K to open/close, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle modal
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Esc to close modal
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }

      // Cmd+D or Ctrl+D to delete selected conversation
      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && hoveredConversation) {
        e.preventDefault();
        handleDelete(hoveredConversation);
      }

      // Cmd+E or Ctrl+E to edit selected conversation
      if (e.key === 'e' && (e.metaKey || e.ctrlKey) && hoveredConversation) {
        e.preventDefault();
        handleEdit(hoveredConversation);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, hoveredConversation]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Filter conversations based on search
  const filteredConversations = search
    ? conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(search.toLowerCase()),
      )
    : conversations;

  // Group filtered conversations by category
  const groupedConversations = categorizeConversations(filteredConversations);

  function handleSelect(id: string) {
    const conversation = conversations.find((c) => c.id === id);
    console.log('Selected:', conversation?.title);
    setOpen(false);
  }

  function createNewChat() {
    console.log('Creating new temporary chat');
    setOpen(false);
  }

  function handleDelete(id: string) {
    console.log('Deleting conversation:', id);
    setConversations(conversations.filter((c) => c.id !== id));
  }

  function handleEdit(id: string) {
    console.log('Editing conversation:', id);
    // Implementation for editing conversation title would go here
  }

  function toggleMoreActions() {
    setShowMoreActions(!showMoreActions);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-neutral-800/40 backdrop-blur-sm z-50 flex items-start justify-center pt-16"
        onClick={() => setOpen(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            ref={modalRef}
            className="bg-background rounded-lg shadow-lg border-border border w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <Command
              className="border-none flex flex-col h-[80vh] max-h-[500px] overflow-hidden rounded-lg"
              shouldFilter={false}
            >
              <div className="flex items-center border-b border-border px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search..."
                  className="flex h-12 w-full bg-transparent py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <Command.List className="overflow-y-auto p-2 custom-scrollbar flex-grow">
                <div className="px-2 pt-2 pb-1 text-xs font-medium text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Actions</span>
                    <button
                      type="button"
                      onClick={toggleMoreActions}
                      className="text-xs text-gray-400 hover:text-gray-200 flex items-center"
                    >
                      {showMoreActions ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                </div>

                <Command.Item
                  onSelect={createNewChat}
                  className="flex items-center gap-2 px-2 py-3 text-gray-200 rounded-md cursor-pointer aria-selected:bg-neutral-800"
                >
                  <div className="flex items-center justify-center h-6 w-6 rounded">
                    <TimerIcon className="h-4 w-4" />
                  </div>
                  <span>Create New Temporary Chat</span>
                </Command.Item>

                {showMoreActions && (
                  <>
                    <Command.Item
                      onSelect={() => console.log('Export all conversations')}
                      className="flex items-center gap-2 px-2 py-3 text-gray-200 rounded-md cursor-pointer aria-selected:bg-neutral-800"
                    >
                      <div className="flex items-center justify-center h-6 w-6 rounded">
                        <FileScript className="h-4 w-4" />
                      </div>
                      <span>Attach files</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => console.log('Export all conversations')}
                      className="flex items-center gap-2 px-2 py-3 text-gray-200 rounded-md cursor-pointer aria-selected:bg-neutral-800"
                    >
                      <div className="flex items-center justify-center h-6 w-6 rounded">
                        <LogOut size={16} />
                      </div>
                      <span>Sign out</span>
                    </Command.Item>
                  </>
                )}

                {Object.entries(groupedConversations).map(
                  ([category, items]) => (
                    <div key={category}>
                      <div className="px-2 pt-4 pb-1 text-xs font-medium text-gray-400">
                        {category}
                      </div>
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          onSelect={() => handleSelect(item.id)}
                          onMouseEnter={() => setHoveredConversation(item.id)}
                          onMouseLeave={() => setHoveredConversation(null)}
                          className="flex items-center justify-between px-2 py-3 text-gray-200 rounded-md cursor-pointer group aria-selected:bg-neutral-800"
                        >
                          <span className="truncate flex-grow">
                            {item.title}
                          </span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mr-2">
                              {item.timeAgo}
                            </span>
                            <div
                              className={`flex space-x-1 transition-opacity ${hoveredConversation === item.id ? 'opacity-100' : 'opacity-0'}`}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item.id);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Edit"
                              >
                                <Edit size={14} className="text-gray-300" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Delete"
                              >
                                <Trash size={14} className="text-gray-300" />
                              </button>
                            </div>
                          </div>
                        </Command.Item>
                      ))}
                    </div>
                  ),
                )}

                {Object.keys(groupedConversations).length === 0 && (
                  <div className="px-2 py-6 text-center text-neutral-400">
                    No conversations found
                  </div>
                )}
              </Command.List>

              <div className="border-t border-border p-3 flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  <span className="mr-4">CTRL+K: Open/Close</span>
                  <span className="mr-4">CTRL+D: Delete</span>
                  <span>⌘+E: Edit</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CSS for custom scrollbar - made more visible */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          display: block;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 20px;
          border: 2px solid #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
          overflow-y: scroll;
        }
      `}</style>
    </>
  );
}
