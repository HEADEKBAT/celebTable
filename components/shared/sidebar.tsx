import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CelebritiesTable from "./CelebritiesTable";

export default function Layout({}: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />

        <CelebritiesTable />
      </main>
    </SidebarProvider>
  );
}
