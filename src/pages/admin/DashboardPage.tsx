/**
 * DashboardPage
 * Visão geral do workspace com estatísticas e atalhos
 */

import { useEffect } from "react";
import { usePageStore } from "@/store/usePageStore";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { StatsCards } from "@/features/dashboard/components/StatsCards";
import { DashboardChart } from "@/features/dashboard/components/DashboardChart";
import { RecentConsultations } from "@/features/dashboard/components/RecentConsultations";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const DashboardPage = () => {
  const { setPageInfo } = usePageStore();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  useEffect(() => {
    setPageInfo("Dashboard", "Visão geral da sua clínica");
  }, [setPageInfo]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Erro ao carregar dashboard
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Não foi possível obter as estatísticas. Verifique sua conexão e tente novamente.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="w-full space-y-4 flex-1 flex flex-col min-h-0">
        {/* Cards de Estatísticas */}
        <div className="shrink-0">
          <StatsCards stats={stats} />
        </div>

        {/* Grid com altura fixa */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Gráfico Principal */}
          <div className="lg:col-span-2 min-h-0">
            <DashboardChart data={stats.chart_data} />
          </div>

          {/* Coluna Lateral */}
          <div className="min-h-0 flex flex-col gap-4">
            {/* Ação Rápida */}
            <div className="shrink-0">
              <QuickActions />
            </div>

            {/* Lista de Consultas */}
            <div className="flex-1 min-h-0">
              <RecentConsultations consultations={stats.recent_consultations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
