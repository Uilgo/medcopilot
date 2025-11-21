/**
 * Select Component
 * Select nativo simples e acessível
 */

import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "flex h-11 w-full rounded-lg border",
              "bg-white dark:bg-gray-900 px-4 py-2 pr-10 text-sm",
              "text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-2 transition-all",
              "appearance-none cursor-pointer",
              error
                ? "border-critical-500 focus:border-critical-600 focus:ring-critical-500/20"
                : "border-gray-300 dark:border-gray-600 focus:border-medical-500 focus:ring-medical-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          >
            {children}
          </select>
          {/* Ícone de seta */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-critical-600 dark:text-critical-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export type SelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ ...props }, ref) => {
    return <option ref={ref} {...props} />;
  }
);

SelectOption.displayName = "SelectOption";
