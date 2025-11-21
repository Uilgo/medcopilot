/**
 * Drawer Component - Painel lateral deslizante
 */

import { X } from "lucide-react";
import { useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-full max-w-md min-w-[384px]",
  md: "w-full max-w-lg min-w-[512px]",
  lg: "w-full max-w-2xl min-w-[672px]",
  xl: "w-full max-w-4xl min-w-[896px]",
};

export const Drawer = ({ isOpen, onClose, title, children, size = "lg" }: DrawerProps) => {
  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full ${sizeClasses[size]} bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
};
