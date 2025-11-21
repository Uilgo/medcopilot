import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 group",
        className
      )}
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/50 dark:bg-transparent backdrop-blur-sm">{children}</div>
    </div>
  );
}
