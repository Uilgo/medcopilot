/**
 * DefaultLayout
 * Layout padrão para páginas do painel de gerenciamento
 */

import { Outlet } from "react-router-dom";
import { Header } from "@/features/admin/components/layouts/Header";
import { Sidebar } from "@/features/admin/components/layouts/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const DefaultLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Content area */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
