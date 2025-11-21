/**
 * Hook para gerenciar seleção de pacientes
 * Usa React Query para cache e gerenciamento de estado
 */

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";
import type { Patient } from "../types/consultation.types";

export const usePatientSelection = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const workspace = useWorkspace();
  const queryClient = useQueryClient();

  // Query para buscar pacientes
  const {
    data: patients = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patients", workspace?.slug],
    queryFn: async () => {
      if (!workspace) return [];

      const response = await api.get(`/${workspace.slug}/patients`);
      const patientsData = response.data.data || response.data;

      if (Array.isArray(patientsData)) {
        return patientsData as Patient[];
      }

      return [];
    },
    enabled: !!workspace,
    staleTime: 1000 * 60 * 10, // Cache por 10 minutos
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  const selectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
  };

  const addNewPatient = (patient: Patient) => {
    // Atualizar cache do React Query
    queryClient.setQueryData(["patients", workspace?.slug], (old: Patient[] = []) => [
      ...old,
      patient,
    ]);
    setSelectedPatient(patient);
  };

  const refreshPatients = async () => {
    await refetch();
  };

  // Retornar valores padrão se não houver workspace
  if (!workspace) {
    return {
      patients: [],
      selectedPatient: null,
      isLoading: false,
      error: "Workspace não encontrado",
      selectPatient: () => {},
      addNewPatient: () => {},
      refreshPatients: () => Promise.resolve(),
    };
  }

  return {
    patients,
    selectedPatient,
    isLoading,
    error: error ? "Erro ao carregar pacientes" : null,
    selectPatient,
    addNewPatient,
    refreshPatients,
  };
};
