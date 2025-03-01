import { ChatForm } from './chat-form';
import { Header } from './header';

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col h-full">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-medium mb-12">
          How can I help you today?
        </h1>

        <ChatForm />

        {/* <div className="flex flex-col sm:flex-row items-start gap-4 mt-4 max-w-2xl">
          <div className="flex flex-col gap-4 sm:w-1/2">
            <p>Trending</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
