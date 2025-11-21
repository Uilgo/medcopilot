/**
 * DashboardSkeleton - Loading placeholder para o dashboard
 */

import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Quick Actions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[120px] rounded-2xl" />
          <Skeleton className="h-[260px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
