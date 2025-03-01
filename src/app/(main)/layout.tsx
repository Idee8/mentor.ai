import AppSidebar, { SidebarProvider } from '@/components/app-sidebar';

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-3">{children}</main>
      </div>
    </SidebarProvider>
  );
}
