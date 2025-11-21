/**
 * Tab de Análises - Lista de análises de IA
 */

import { useState } from "react";
import {
  Sparkles,
  Activity,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Pill,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ViewToggle, type ViewMode } from "@/components/ui/ViewToggle";
import type { AnalysisHistory } from "../hooks/useAnalysisHistory";
import { AnalysisDetailsDrawer } from "./AnalysisDetailsDrawer";

interface AnalysesTabProps {
  analysisData: {
    analyses: AnalysisHistory[];
    isLoading: boolean;
    error: string | null;
  };
}

export const AnalysesTab = ({ analysisData }: AnalysesTabProps) => {
  const { analyses, isLoading, error } = analysisData;
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (analysis: AnalysisHistory) => {
    setSelectedAnalysis(analysis);
    setIsDrawerOpen(true);
  };

  // Filtrar análises baseado na busca
  const filteredAnalyses = analyses.filter(
    (a) =>
      a.consulta.paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.consulta.queixa_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.cid10 && a.cid10.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "text-critical-600 dark:text-critical-400";
      case "alta":
        return "text-alert-600 dark:text-alert-400";
      case "media":
        return "text-warning-600 dark:text-warning-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-medical-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-critical-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de Busca */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="relative w-full sm:w-[450px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico ou CID-10..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
          />
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* Header com contador */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-medical-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {filteredAnalyses.length} análises encontradas
        </h3>
      </div>

      {/* Lista de Análises */}
      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Nenhuma análise encontrada</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          }
        >
          {filteredAnalyses.map((analysis) =>
            viewMode === "list" ? (
              // List View
              <div
                key={analysis.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-medical-500 dark:hover:border-medical-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {analysis.consulta.paciente.nome}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                        • {analysis.consulta.queixa_principal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {analysis.diagnosis}
                      </p>
                      {analysis.cid10 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-medical-600 text-white">
                          {analysis.cid10}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(analysis.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5" />
                      <span>{analysis.suggestedExams.length} exames</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Pill className="h-3.5 w-3.5" />
                      <span>{analysis.suggestedMedications.length} medicamentos</span>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-medical-100 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 shrink-0">
                    {analysis.confidence}%
                  </span>

                  <Button
                    size="sm"
                    variant="primary"
                    className="shrink-0"
                    onClick={() => handleViewDetails(analysis)}
                  >
                    Ver Análise
                  </Button>
                </div>
              </div>
            ) : (
              // Grid View
              <div
                key={analysis.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-medical-500 dark:hover:border-medical-400 transition-colors flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between min-h-[56px]">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {analysis.consulta.paciente.nome}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {analysis.consulta.queixa_principal}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-medical-100 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 shrink-0 whitespace-nowrap">
                    {analysis.confidence}%
                  </span>
                </div>

                {/* Diagnóstico */}
                <div className="bg-medical-50 dark:bg-medical-900/10 rounded-lg p-3 min-h-[80px]">
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-medical-600 dark:text-medical-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {analysis.diagnosis}
                      </p>
                      {analysis.cid10 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-medical-600 text-white inline-block">
                          CID-10: {analysis.cid10}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sintomas */}
                <div>
                  <div className="flex items-center gap-1 mb-2 h-5">
                    <Activity className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Sintomas:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.symptoms.slice(0, 3).map((symptom, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {symptom}
                      </span>
                    ))}
                    {analysis.symptoms.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        +{analysis.symptoms.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Exames */}
                <div>
                  <div className="flex items-center gap-1 mb-2 h-5">
                    <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Exames: {analysis.suggestedExams.length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {analysis.suggestedExams.slice(0, 2).map((exam, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
                      >
                        <span className={getPriorityColor(exam.prioridade)}>•</span>
                        <span className="truncate">{exam.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medicamentos */}
                <div>
                  <div className="flex items-center gap-1 h-5">
                    <Pill className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Medicamentos: {analysis.suggestedMedications.length}
                    </span>
                  </div>
                </div>

                {/* Spacer para empurrar metadados e botão para o final */}
                <div className="flex-1" />

                {/* Metadados - Fixo no final */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    {new Date(analysis.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <Clock className="h-3.5 w-3.5 shrink-0 ml-1" />
                  <span className="whitespace-nowrap">
                    {new Date(analysis.created_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Ações */}
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  onClick={() => handleViewDetails(analysis)}
                >
                  Ver Análise Completa
                </Button>
              </div>
            )
          )}
        </div>
      )}

      {/* Drawer de Detalhes */}
      <AnalysisDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        analysis={selectedAnalysis}
      />
    </div>
  );
};
