/**
 * HistoricoPage
 * Página de histórico com tabs: Consultas | Análises
 */

import { useEffect, useState } from "react";
import { usePageStore } from "@/store/usePageStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ConsultationsTab } from "@/features/history/components/ConsultationsTab";
import { AnalysesTab } from "@/features/history/components/AnalysesTab";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { useConsultationHistory } from "@/features/history/hooks/useConsultationHistory";
import { useAnalysisHistory } from "@/features/history/hooks/useAnalysisHistory";

export const HistoricoPage = () => {
  const { setPageInfo } = usePageStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Buscar dados uma única vez no nível da página
  const consultationData = useConsultationHistory(refreshTrigger);
  const analysisData = useAnalysisHistory(refreshTrigger);

  useEffect(() => {
    setPageInfo("Histórico", "Visualize e gerencie o histórico de consultas e análises");
  }, [setPageInfo]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);

    // Remove o estado de loading após um tempo
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="consultas" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="analises">Análises</TabsTrigger>
          </TabsList>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="md"
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        <TabsContent value="consultas" className="flex-1">
          <ConsultationsTab consultationData={consultationData} />
        </TabsContent>

        <TabsContent value="analises" className="flex-1">
          <AnalysesTab analysisData={analysisData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
