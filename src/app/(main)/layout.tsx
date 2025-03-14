import type { Metadata } from 'next';

import AppSidebar, { SidebarProvider } from '@/components/app-sidebar';

export const metadata: Metadata = {
  title: { absolute: 'Mentor AI', template: '%s | Mentor AI' },
};

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
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
