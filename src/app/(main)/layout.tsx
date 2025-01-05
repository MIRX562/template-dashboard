import DynamicBreadcrumb from "@/components/app-breadcrumbs";
import { AppSidebar } from "@/components/app-sidebar";
import { DateTimeWidget } from "@/components/date-time-widget";
import { NotificationPanel } from "@/components/notification-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import NotAuthorizedPage from "@/components/ui/not-authorized";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  if (!user) return <NotAuthorizedPage />;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky bg-background/90 backdrop-blur-md top-0 z-10 flex h-16 shrink-0 px-4 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-8" />
            <DynamicBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <DateTimeWidget />
            <Separator orientation="vertical" className="mr-2 h-8" />
            <ThemeToggle />
            <NotificationPanel />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
