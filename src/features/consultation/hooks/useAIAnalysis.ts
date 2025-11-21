/**
 * Hook para gerenciar análise de IA em tempo real
 * NOVO FLUXO: Análise fica em estado local até finalizar consulta
 */

import { useState, useEffect } from "react";
import type { AIAnalysis, ChatMessage } from "../types/consultation.types";

const ANALYSIS_STORAGE_KEY = "active_consultation_analysis";

export const useAIAnalysis = (patientId?: string, messages?: ChatMessage[]) => {
  // Inicializar análise do localStorage
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(() => {
    try {
      const stored = localStorage.getItem(ANALYSIS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao recuperar análise do localStorage:", error);
    }
    return null;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Salvar análise no localStorage sempre que mudar
  useEffect(() => {
    if (analysis) {
      localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    } else {
      localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    }
  }, [analysis]);

  const analyzeConsultation = async () => {
    if (!patientId || !messages || messages.length === 0) {
      setError("Dados insuficientes para análise");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simular análise da IA localmente
      // TODO: Implementar chamada real à IA quando necessário
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAnalysis: AIAnalysis = {
        symptoms: messages
          .filter((msg) => msg.type === "user")
          .map((msg) => msg.content)
          .slice(0, 5),
        diagnosis: "Análise em andamento...",
        cid10: undefined,
        suggestedExams: [],
        suggestedMedications: [],
        confidence: 0.7,
        notes: "Análise baseada nas informações coletadas durante a consulta.",
      };

      setAnalysis(mockAnalysis);
    } catch (err: unknown) {
      setError("Erro ao gerar análise médica");
      console.error("Erro na análise de IA:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeConsultation,
    clearAnalysis,
  };
};
