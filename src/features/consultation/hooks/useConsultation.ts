/**
 * Hook para gerenciar consultas
 * NOVO FLUXO: Consulta só é salva no banco ao finalizar
 */

import { useState, useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

interface LocalConsultation {
  paciente_id: string;
  profissional_id: string;
  queixa_principal: string;
  iniciada_em: string;
}

const STORAGE_KEY = "active_consultation";

export const useConsultation = (patientId?: string) => {
  const workspace = useWorkspace();
  const user = useAuthStore((state) => state.user);

  // Inicializar estado do localStorage
  const [localConsultation, setLocalConsultation] = useState<LocalConsultation | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verificar se a consulta armazenada é do mesmo paciente
        if (patientId && parsed.paciente_id === patientId) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Erro ao recuperar consulta do localStorage:", error);
    }
    return null;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (localConsultation) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localConsultation));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [localConsultation]);

  // Limpar consulta quando o paciente mudar (apenas se for diferente)
  useEffect(() => {
    if (patientId && localConsultation && localConsultation.paciente_id !== patientId) {
      setLocalConsultation(null);
      setError(null);
    }
  }, [patientId, localConsultation]);

  // Iniciar consulta localmente (não salva no banco)
  const startConsultation = (pacienteId: string, queixaPrincipal: string = "Consulta iniciada") => {
    if (!user?.id) {
      setError("Usuário não identificado");
      return null;
    }

    const consultation: LocalConsultation = {
      paciente_id: pacienteId,
      profissional_id: user.id,
      queixa_principal: queixaPrincipal,
      iniciada_em: new Date().toISOString(),
    };

    setLocalConsultation(consultation);
    return consultation;
  };

  // Finalizar e salvar consulta no banco
  const finishConsultation = async (
    messages: Array<{ conteudo: string; tipo_mensagem: string; audio_url?: string }>,
    analysis?: {
      diagnostico?: string;
      cid10?: string;
      sintomas?: string[];
      exames_sugeridos?: Array<{ nome: string; justificativa: string }>;
      medicamentos_sugeridos?: Array<{ nome: string; dosagem: string; frequencia: string }>;
      notas_clinicas?: string;
      nivel_confianca?: string;
    }
  ) => {
    if (!workspace || !localConsultation) {
      setError("Consulta não iniciada ou workspace não encontrado");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Calcular duração em minutos
      const iniciada = new Date(localConsultation.iniciada_em);
      const concluida = new Date();
      const duracao_minutos = Math.round((concluida.getTime() - iniciada.getTime()) / 60000);

      // Salvar consulta completa no banco usando o novo endpoint
      const response = await api.post(`/${workspace.slug}/consultations/complete`, {
        paciente_id: localConsultation.paciente_id,
        profissional_id: localConsultation.profissional_id,
        queixa_principal: localConsultation.queixa_principal,
        iniciada_em: localConsultation.iniciada_em,
        concluida_em: concluida.toISOString(),
        duracao_minutos,
        messages,
        analysis,
      });

      const consultationData = response.data.data || response.data;
      setLocalConsultation(null); // Limpar estado local e localStorage
      localStorage.removeItem(STORAGE_KEY);
      return consultationData;
    } catch (err: unknown) {
      let errorMessage = "Erro ao salvar consulta";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      }
      setError(errorMessage);
      console.error("Erro ao salvar consulta:", err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const clearConsultation = () => {
    setLocalConsultation(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    localConsultation,
    isConsultationStarted: !!localConsultation,
    isSaving,
    error,
    startConsultation,
    finishConsultation,
    clearConsultation,
  };
};
