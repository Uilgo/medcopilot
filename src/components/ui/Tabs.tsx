/**
 * Tabs Component
 * Sistema de abas reutilizável
 */

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
};

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({ defaultValue, value, children, className, onValueChange }: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    // Se não tiver defaultValue, pega o primeiro tab disponível
    return defaultValue || "";
  });

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const handleTabChange = (newValue: string) => {
    if (!isControlled) {
      setInternalActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-start rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger = ({ value, children, className, disabled = false }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
          : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50",
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
};
