import { cookies } from 'next/headers';

import { Header } from './header';
import { generateUUID } from '@/lib/utils';
import { Form } from './form';
import { DEFAULT_CHAT_MODEL } from '@/ai/models';

export default async function DashboardPage() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelFromCookie = cookieStore.get('chat-model');

  return (
    <div className="w-full flex flex-col h-full">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-medium mb-12">
          How can I help you today?
        </h1>

        <Form
          id={id}
          initialMessages={[]}
          selectedChatModel={modelFromCookie?.name || DEFAULT_CHAT_MODEL}
        />
      </div>
    </div>
  );
}
