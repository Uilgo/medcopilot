/**
 * Popover Component
 * Popover reutilizável com trigger e conteúdo
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerMode?: "hover" | "click";
  hoverDelay?: number;
}

export const Popover = ({
  trigger,
  children,
  align = "start",
  side = "bottom",
  className,
  contentClassName,
  open: controlledOpen,
  onOpenChange,
  triggerMode = "hover",
  hoverDelay = 200,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

    // Calculate position based on side
    switch (side) {
      case "bottom":
        top = triggerRect.bottom + spacing + window.scrollY;
        break;
      case "top":
        top = triggerRect.top - contentRect.height - spacing + window.scrollY;
        break;
      case "left":
        left = triggerRect.left - contentRect.width - spacing + window.scrollX;
        top = triggerRect.top + window.scrollY;
        break;
      case "right":
        left = triggerRect.right + spacing + window.scrollX;
        top = triggerRect.top + window.scrollY;
        break;
    }

    // Calculate alignment
    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          left = triggerRect.left + window.scrollX;
          break;
        case "center":
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 + window.scrollX;
          break;
        case "end":
          left = triggerRect.right - contentRect.width + window.scrollX;
          break;
      }
    } else {
      switch (align) {
        case "start":
          top = triggerRect.top + window.scrollY;
          break;
        case "center":
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 + window.scrollY;
          break;
        case "end":
          top = triggerRect.bottom - contentRect.height + window.scrollY;
          break;
      }
    }

    setPosition({ top, left });
  }, [side, align]);

  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to avoid setState during render
      requestAnimationFrame(() => {
        updatePosition();
      });
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange]
  );

  const handleMouseEnter = useCallback(() => {
    if (triggerMode === "hover") {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        handleOpenChange(true);
      }, hoverDelay);
    }
  }, [triggerMode, hoverDelay, handleOpenChange]);

  const handleMouseLeave = useCallback(() => {
    if (triggerMode === "hover") {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        handleOpenChange(false);
      }, 100);
    }
  }, [triggerMode, handleOpenChange]);

  const handleClick = useCallback(() => {
    if (triggerMode === "click") {
      handleOpenChange(!isOpen);
    }
  }, [triggerMode, isOpen, handleOpenChange]);

  // Close on click outside
  useEffect(() => {
    if (triggerMode === "click" && isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, triggerMode, handleOpenChange]);

  // Close on ESC
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleOpenChange(false);
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleOpenChange]);

  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={cn("inline-block cursor-pointer", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {trigger}
      </div>

      {/* Content */}
      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            className={cn("z-50 animate-in fade-in-0 zoom-in-95", contentClassName)}
            onMouseEnter={triggerMode === "hover" ? handleMouseEnter : undefined}
            onMouseLeave={triggerMode === "hover" ? handleMouseLeave : undefined}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};
