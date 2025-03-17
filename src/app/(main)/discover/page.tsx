import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover',
};
export default async function DiscoverPage() {
  return (
    <div className="flex w-full h-full justify-center items-center py-10">
      <p className="text-3xl">Discover chats and documents from others.</p>
    </div>
  );
}
