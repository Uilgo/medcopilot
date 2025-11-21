/**
 * ViewToggle Component
 * Alternador entre visualização em grid e lista
 */

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

export const ViewToggle = ({ value, onChange, className }: ViewToggleProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center h-11 rounded-lg bg-gray-100 dark:bg-gray-800 p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 h-9 text-sm font-medium transition-all cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500",
          value === "grid"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
        title="Visualização em grade"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 h-9 text-sm font-medium transition-all cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500",
          value === "list"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
        title="Visualização em lista"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};
