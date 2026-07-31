import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./_component/AppHeader";
import AppSidebar from "./_component/AppSideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-8 bg-muted/20">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
