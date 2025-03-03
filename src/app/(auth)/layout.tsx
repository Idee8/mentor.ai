'use client';

import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  const { data, isPending } = useSession();

  if (isPending || !data) {
    // TODO: make this loading state better
    return null;
  }

  if (data.user) {
    redirect('/dash');
  }
  return <div>{children}</div>;
}
