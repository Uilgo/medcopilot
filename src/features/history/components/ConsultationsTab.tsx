/**
 * Tab de Consultas - Lista de consultas realizadas
 */

import { useState } from "react";
import { Search, Calendar, User, Clock, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ViewToggle, type ViewMode } from "@/components/ui/ViewToggle";
import type { ConsultationHistory, HistoryFilter } from "../types/history.types";
import { ConsultationDetailsDrawer } from "./ConsultationDetailsDrawer";
import { HistorySkeleton } from "./HistorySkeleton";

interface ConsultationsTabProps {
  consultationData: {
    consultations: ConsultationHistory[];
    isLoading: boolean;
    error: string | null;
    filter: HistoryFilter;
    updateFilter: (filter: Partial<HistoryFilter>) => void;
    clearFilters: () => void;
  };
}

export const ConsultationsTab = ({ consultationData }: ConsultationsTabProps) => {
  const { consultations, isLoading, error, clearFilters } = consultationData;

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationHistory | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (consultation: ConsultationHistory) => {
    setSelectedConsultation(consultation);
    setIsDrawerOpen(true);
  };

  // Filtrar consultas localmente baseado na busca e status
  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      !searchTerm ||
      consultation.paciente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.queixa_principal.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return <HistorySkeleton />;
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
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="relative w-full sm:w-[450px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Buscar por paciente ou queixa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
          />
        </div>

        <div className="flex gap-2 items-center">
          <ViewToggle value={viewMode} onChange={setViewMode} />

          {searchTerm && (
            <Button
              onClick={() => {
                setSearchTerm("");
                clearFilters();
              }}
              variant="outline"
              size="md"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Consultas */}
      {filteredConsultations.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Nenhuma consulta encontrada</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {filteredConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              viewMode={viewMode}
              calculateAge={calculateAge}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Drawer de Detalhes */}
      <ConsultationDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        consultation={selectedConsultation}
      />
    </div>
  );
};

interface ConsultationCardProps {
  consultation: ConsultationHistory;
  viewMode: ViewMode;
  calculateAge: (birthDate: string) => number;
  onViewDetails: (consultation: ConsultationHistory) => void;
}

const ConsultationCard = ({
  consultation,
  viewMode,
  calculateAge,
  onViewDetails,
}: ConsultationCardProps) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-medical-500 dark:hover:border-medical-400 transition-colors">
        <div className="flex items-center gap-4">
          {/* Info Principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <User className="h-4 w-4 text-gray-400 shrink-0" />
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {consultation.paciente?.nome || "Paciente não identificado"}
              </h3>
              {consultation.paciente?.data_nascimento && (
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {calculateAge(consultation.paciente.data_nascimento)} anos
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {consultation.queixa_principal}
            </p>
          </div>

          {/* Metadados */}
          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(consultation.iniciada_em).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {new Date(consultation.iniciada_em).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {consultation.mensagens_count !== undefined && (
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>{consultation.mensagens_count}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(consultation)}>
              Ver Detalhes
            </Button>
            {consultation.analise && (
              <Button size="sm" variant="primary">
                Ver Análise
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-medical-500 dark:hover:border-medical-400 transition-colors flex flex-col h-full">
      {/* Conteúdo que cresce */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-400 shrink-0" />
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {consultation.paciente?.nome || "Paciente não identificado"}
              </h3>
            </div>
            {consultation.paciente?.data_nascimento && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {calculateAge(consultation.paciente.data_nascimento)} anos
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {consultation.queixa_principal}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {new Date(consultation.iniciada_em).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {new Date(consultation.iniciada_em).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {consultation.mensagens_count !== undefined && (
            <div className="flex items-center gap-1.5 col-span-2">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>{consultation.mensagens_count} mensagens</span>
            </div>
          )}
        </div>
      </div>

      {/* Botão fixo no final */}
      <Button
        size="sm"
        variant="outline"
        className="w-full mt-4"
        onClick={() => onViewDetails(consultation)}
      >
        Ver Detalhes
      </Button>
    </div>
  );
};
