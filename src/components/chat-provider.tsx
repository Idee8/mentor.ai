'use client';

import type { Chat } from '@/db/schema';
import type { User } from 'better-auth';
import { useSession } from '@/lib/auth-client';
import { notFound, useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface ChatContextProps {
  chat: Chat;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
}

const ChatContext = createContext<ChatContextProps>({
  chat: {} as Chat,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isOwner: false,
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider: React.FC<{
  children: ReactNode;
  chat: Chat;
}> = ({ children, chat }) => {
  const { data, isPending } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When session data is loaded, update loading state
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending]);

  // Check if user is authenticated
  const isAuthenticated = !!data?.user;

  // Check if user is the owner of the chat
  const isOwner = isAuthenticated && data.user.id === chat.userId;

  // Handle private chat access
  if (chat.visibility === 'private') {
    if (!isAuthenticated) {
      // Redirect to login or show not found based on your app's flow
      return notFound();
    }

    if (!isOwner) {
      // If authenticated but not the owner of a private chat
      return notFound();
    }
  }

  const contextValue: ChatContextProps = {
    chat,
    user: data?.user || null,
    isLoading,
    isAuthenticated,
    isOwner,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Page wrapper component to handle authentication and access control
export const ChatPageProvider: React.FC<{
  children: ReactNode;
  chat: Chat;
}> = ({ children, chat }) => {
  const { data, isPending } = useSession();

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Handle private chat access control
  if (chat.visibility === 'private') {
    if (!data?.session || !data.user) {
      return notFound();
    }

    if (data.user.id !== chat.userId) {
      return notFound();
    }
  }

  return <ChatProvider chat={chat}>{children}</ChatProvider>;
};
