import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await auth.api.getSession({ headers: await headers() });

  if (authSession?.session && authSession.user) {
    redirect('/chat');
  }
  return <div>{children}</div>;
}
