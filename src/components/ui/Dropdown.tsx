/**
 * Dropdown Component
 * Menu dropdown simples
 */

import { forwardRef, useState, useEffect, useRef, useCallback } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  align?: "left" | "right" | "center";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = ({
  trigger,
  children,
  align = "left",
  open: controlledOpen,
  onOpenChange,
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Usar controlled ou uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute z-(--z-dropdown) mt-2 w-max",
            "bg-(--color-bg-elevated) rounded-lg shadow-lg",
            "border border-(--color-border-primary)",
            "p-1.5",
            alignmentClasses[align]
          )}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  );
};

export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?: "default" | "danger";
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, disabled, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default:
        "text-clinical-900 dark:text-clinical-50 hover:bg-clinical-100 dark:hover:bg-clinical-800",
      danger:
        "text-critical-600 hover:bg-critical-50 dark:text-critical-400 dark:hover:bg-critical-900/20",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full text-left px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer rounded-md mb-0.5 last:mb-0",
          "focus:outline-none focus:bg-clinical-100 dark:focus:bg-clinical-800",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-1 h-px bg-(--color-border-secondary)", className)}
        {...props}
      />
    );
  }
);

DropdownSeparator.displayName = "DropdownSeparator";

export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>;

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-2 text-xs font-semibold text-(--color-text-tertiary) uppercase tracking-wider",
          className
        )}
        {...props}
      />
    );
  }
);

DropdownLabel.displayName = "DropdownLabel";
