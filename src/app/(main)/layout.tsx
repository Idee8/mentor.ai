import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import AppSidebar, { SidebarProvider } from '@/components/app-sidebar';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: { absolute: 'Mentor', template: '%s | Mentor AI' },
};

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await auth.api.getSession({ headers: await headers() });

  if (!authSession || !authSession.user) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className="group/sidebar-wrapper flex w-full justify-center">
        <AppSidebar />
        <div className="relative w-full grid grid-cols-1 grid-rows-[auto_1fr]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
