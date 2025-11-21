/**
 * Hook para buscar histórico de consultas
 */

import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";
import type {
  ConsultationHistory,
  HistoryFilter,
  HistorySortField,
  HistorySortOrder,
} from "../types/history.types";

export const useConsultationHistory = (refreshTrigger?: number) => {
  const workspace = useWorkspace();
  const [consultations, setConsultations] = useState<ConsultationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<HistoryFilter>({ status: "all" });
  const [sortField, setSortField] = useState<HistorySortField>("iniciada_em");
  const [sortOrder, setSortOrder] = useState<HistorySortOrder>("desc");

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!workspace) return;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Não envia search para API - filtragem será feita no frontend
        if (filter.status && filter.status !== "all") params.append("status", filter.status);
        if (filter.dateFrom) params.append("dateFrom", filter.dateFrom);
        if (filter.dateTo) params.append("dateTo", filter.dateTo);
        if (filter.patientId) params.append("patientId", filter.patientId);
        if (filter.professionalId) params.append("professionalId", filter.professionalId);

        params.append("sortField", sortField);
        params.append("sortOrder", sortOrder);

        const response = await api.get(`/${workspace.slug}/consultations?${params.toString()}`);

        setConsultations(response.data.data || response.data || []);
      } catch (err) {
        console.error("Erro ao buscar consultas:", err);
        setError("Erro ao carregar histórico de consultas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [
    workspace,
    filter.status,
    filter.dateFrom,
    filter.dateTo,
    filter.patientId,
    filter.professionalId,
    sortField,
    sortOrder,
    refreshTrigger,
  ]);

  const updateFilter = useCallback((newFilter: Partial<HistoryFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const updateSort = useCallback((field: HistorySortField, order: HistorySortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({ status: "all" });
  }, []);

  return {
    consultations,
    isLoading,
    error,
    filter,
    sortField,
    sortOrder,
    updateFilter,
    updateSort,
    clearFilters,
  };
};
