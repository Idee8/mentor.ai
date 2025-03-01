import { Chat } from '@/components/chat';
import { ChatHeader } from '@/components/chat-header';

export default function ChatPage() {
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Chat />
    </div>
  );
}
