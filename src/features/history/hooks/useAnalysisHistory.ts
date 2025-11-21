/**
 * Hook para buscar histórico de análises de IA
 */

import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";

export interface AnalysisHistory {
  id: string;
  consultation_id: string;
  diagnosis: string;
  cid10: string | null;
  confidence: number;
  symptoms: string[];
  created_at: string;
  modelo_ia: string;
  suggestedExams: Array<{
    nome: string;
    prioridade: "urgente" | "alta" | "media" | "baixa" | "rotina";
    justificativa: string;
  }>;
  suggestedMedications: Array<{
    nome: string;
    dosagem: string;
    frequencia: string;
    duracao: string;
  }>;
  notas_clinicas: string;
  consulta: {
    id: string;
    queixa_principal: string;
    iniciada_em: string;
    paciente: {
      nome: string;
    };
  };
}

interface AnalysisFilter {
  consultationId?: string;
  dateFrom?: string;
  dateTo?: string;
  minConfidence?: number;
}

export const useAnalysisHistory = (refreshTrigger?: number) => {
  const workspace = useWorkspace();
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AnalysisFilter>({});

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!workspace) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filter.consultationId) params.append("consultationId", filter.consultationId);
        if (filter.dateFrom) params.append("dateFrom", filter.dateFrom);
        if (filter.dateTo) params.append("dateTo", filter.dateTo);
        if (filter.minConfidence) params.append("minConfidence", filter.minConfidence.toString());

        params.append("sortField", "created_at");
        params.append("sortOrder", "desc");

        const response = await api.get(`/${workspace.slug}/ai/analyses?${params.toString()}`);

        setAnalyses(response.data.data || response.data || []);
      } catch (err: unknown) {
        console.error("Erro ao buscar análises:", err);

        // Se a API ainda não está implementada, retorna array vazio sem erro
        if (err?.response?.status === 404 || err?.response?.status === 500) {
          console.warn("API de análises ainda não implementada ou com erro");
          setAnalyses([]);
          setError(null); // Não mostra erro, apenas retorna vazio
        } else {
          setError("Erro ao carregar histórico de análises");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [
    workspace,
    filter.consultationId,
    filter.dateFrom,
    filter.dateTo,
    filter.minConfidence,
    refreshTrigger,
  ]);

  const updateFilter = useCallback((newFilter: Partial<AnalysisFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
  }, []);

  return {
    analyses,
    isLoading,
    error,
    filter,
    updateFilter,
    clearFilters,
  };
};
