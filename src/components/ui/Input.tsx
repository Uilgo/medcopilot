import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      label,
      className = "",
      id,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      rightElement,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasLeftIcon = !!LeftIcon;
    const hasRightIcon = !!RightIcon || !!rightElement;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center text-gray-500 dark:text-gray-400 pointer-events-none">
              <LeftIcon className="h-5 w-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`h-10 w-full bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none focus:outline-none shadow-none focus:shadow-none transition-colors ${
              hasLeftIcon ? "pl-11" : "pl-4"
            } ${hasRightIcon ? "pr-11" : "pr-4"} ${
              error
                ? "border-critical-500 focus:border-critical-600"
                : "border-gray-300 dark:border-gray-600 focus:border-medical-500 dark:focus:border-medical-400"
            } ${className}`}
            {...props}
          />
          {RightIcon && !rightElement && (
            <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center text-gray-500 dark:text-gray-400 pointer-events-none">
              <RightIcon className="h-5 w-5" />
            </div>
          )}
          {rightElement && (
            <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <div className="h-6 mt-1">
            <p className="text-sm text-critical-600 dark:text-critical-400">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
