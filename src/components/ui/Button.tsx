import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white focus:ring-2 focus:ring-medical-500 dark:bg-medical-500 dark:hover:bg-medical-600",
      secondary:
        "bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white focus:ring-2 focus:ring-accent-500",
      outline:
        "bg-transparent border-2 border-medical-600 text-medical-600 hover:bg-medical-600 hover:text-white focus:ring-2 focus:ring-medical-500 dark:border-medical-500 dark:text-medical-500 dark:hover:bg-medical-500",
      ghost:
        "bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-medical-500",
      link: "bg-transparent text-medical-600 hover:text-medical-700 underline-offset-4 hover:underline focus:ring-2 focus:ring-medical-500 dark:text-medical-400 dark:hover:text-medical-300",
      success:
        "bg-health-600 hover:bg-health-700 active:bg-health-800 text-white focus:ring-2 focus:ring-health-500",
      warning:
        "bg-alert-600 hover:bg-alert-700 active:bg-alert-800 text-white focus:ring-2 focus:ring-alert-500",
      error:
        "bg-critical-600 hover:bg-critical-700 active:bg-critical-800 text-white focus:ring-2 focus:ring-critical-500",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-11 px-8 text-base",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    // Detectar se é Loader2 pelo nome da função
    const isLeftIconLoader = LeftIcon?.name === "Loader2" || LeftIcon?.displayName === "Loader2";
    const isRightIconLoader = RightIcon?.name === "Loader2" || RightIcon?.displayName === "Loader2";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {LeftIcon && (
          <LeftIcon className={`${iconSizes[size]} ${isLeftIconLoader ? "animate-spin" : ""}`} />
        )}
        {children}
        {RightIcon && (
          <RightIcon className={`${iconSizes[size]} ${isRightIconLoader ? "animate-spin" : ""}`} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
