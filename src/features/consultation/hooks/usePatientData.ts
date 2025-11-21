/**
 * Hook para gerenciar dados do paciente selecionado
 */

import { useState, useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";
import type { Patient } from "../types/consultation.types";

export const usePatientData = (patientId?: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workspace = useWorkspace();

  useEffect(() => {
    if (patientId && workspace) {
      loadPatientData(patientId);
    } else {
      setPatient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, workspace]);

  const loadPatientData = async (id: string) => {
    if (!workspace) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Substituir por chamada real à API
      // const response = await api.get(`/${workspace.slug}/patients/${id}`);
      // setPatient(response.data);

      const response = await api.get(`/${workspace.slug}/patients/${id}`);
      // Backend pode retornar { data: {...} } ou diretamente {...}
      const patientData = response.data.data || response.data;
      setPatient(patientData);
    } catch (err) {
      setError("Erro ao carregar dados do paciente");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (data: Partial<Patient>) => {
    if (!patient || !workspace) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/${workspace.slug}/patients/${patient.id}`, data);
      setPatient(response.data);
    } catch (err) {
      setError("Erro ao atualizar paciente");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patient,
    isLoading,
    error,
    updatePatient,
    refreshPatient: () => patientId && loadPatientData(patientId),
  };
};
