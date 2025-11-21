/**
 * Textarea Component
 * Componente de área de texto seguindo o design system MedCopilot
 */

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, rows = 3, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-") || "textarea";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            // Base styles
            "w-full px-4 py-2.5 rounded-lg",
            "text-base text-gray-900 dark:text-white",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "bg-white dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-600",

            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-medical-500 dark:focus:ring-medical-400",
            "focus:border-transparent",

            // Disabled styles
            "disabled:bg-gray-100 dark:disabled:bg-gray-900",
            "disabled:text-gray-500 dark:disabled:text-gray-600",
            "disabled:cursor-not-allowed",

            // Error styles
            error && "border-critical-500 dark:border-critical-400",
            error && "focus:ring-critical-500 dark:focus:ring-critical-400",

            // Transitions
            "transition-colors duration-200",

            // Resize
            "resize-none",

            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "error-message" : helperText ? "helper-text" : undefined}
          {...props}
        />

        {error && (
          <p id="error-message" className="text-xs text-critical-600 dark:text-critical-400 mt-1">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id="helper-text" className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
