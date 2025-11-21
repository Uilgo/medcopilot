/**
 * Modal Component
 * Modal básico com overlay
 */

import { forwardRef, useEffect } from "react";
import type { HTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay com animação */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">{children}</div>
    </>
  );
};

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
  onClose?: () => void;
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, showClose = true, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-lg min-w-[320px]",
          "bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
          "rounded-2xl shadow-2xl",
          "border border-gray-200/50 dark:border-gray-700/50",
          "max-h-[90vh] overflow-y-auto",
          "animate-in zoom-in-95 fade-in duration-300",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-gray-950 cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        )}
        {children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
  }
);

ModalHeader.displayName = "ModalHeader";

export type ModalTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white",
          className
        )}
        {...props}
      />
    );
  }
);

ModalTitle.displayName = "ModalTitle";

export type ModalDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
        {...props}
      />
    );
  }
);

ModalDescription.displayName = "ModalDescription";

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
  }
);

ModalBody.displayName = "ModalBody";

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0",
          className
        )}
        {...props}
      />
    );
  }
);

ModalFooter.displayName = "ModalFooter";
