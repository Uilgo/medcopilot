/**
 * Header Component
 * Header do painel admin inspirado no shadcn/ui
 */

import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePageStore } from "@/store/usePageStore";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const title = usePageStore((state) => state.title);
  const description = usePageStore((state) => state.description);
  const hasHydrated = usePageStore((state) => state._hasHydrated);

  // Evitar FOUC: só renderiza após hidratação
  if (!hasHydrated) {
    return (
      <header className="flex h-20 items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
        <button
          onClick={toggleSidebar}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors mr-4 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-medical-500 dark:focus-visible:ring-medical-400",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300",
            "h-9 w-9"
          )}
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 flex-col">
          {/* Skeleton loading */}
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-20 items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors mr-4 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-medical-500 dark:focus-visible:ring-medical-400",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          "text-gray-700 dark:text-gray-300",
          "h-9 w-9"
        )}
        title="Toggle sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      {/* Page Title & Description */}
      <div className="flex flex-1 flex-col">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
};
