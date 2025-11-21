/**
 * AIAnalysisPanel
 * Painel com análise de IA em tempo real
 */

import { useMemo, useState } from "react";
import {
  Sparkles,
  Activity,
  Stethoscope,
  Pill,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ConfirmAnalysisModal } from "./ConfirmAnalysisModal";
import type { AIAnalysis } from "../types/consultation.types";

interface AIAnalysisPanelProps {
  analysis: AIAnalysis | null;
  isAnalyzing?: boolean;
  onAnalyze?: () => void;
  canAnalyze?: boolean;
  error?: string | null;
}

export const AIAnalysisPanel = ({
  analysis,
  isAnalyzing,
  onAnalyze,
  canAnalyze = false,
  error,
}: AIAnalysisPanelProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleUpdateClick = () => {
    if (analysis) {
      // Se já tem análise, mostrar modal de confirmação
      setIsConfirmModalOpen(true);
    } else {
      // Se não tem análise, gerar diretamente
      onAnalyze?.();
    }
  };

  const handleConfirmUpdate = () => {
    onAnalyze?.();
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center gap-2 text-medical-600 dark:text-medical-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Analisando com IA...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-alert-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao gerar análise
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          {canAnalyze && onAnalyze && (
            <button
              onClick={handleUpdateClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm mb-4">Aguardando dados da consulta</p>
          {canAnalyze && onAnalyze && (
            <button
              onClick={handleUpdateClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Gerar Análise com IA
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-medical-600 dark:text-medical-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Análise IA em Tempo Real
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              analysis.confidence >= 70
                ? "bg-medical-100 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400"
                : "bg-alert-100 dark:bg-alert-900/20 text-alert-700 dark:text-alert-400"
            }`}
          >
            Confiança: {analysis.confidence}%
          </span>
          {canAnalyze && onAnalyze && (
            <button
              onClick={handleUpdateClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-medical-600 hover:bg-medical-700 text-white rounded-lg transition-colors cursor-pointer"
              title="Atualizar análise"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar
            </button>
          )}
        </div>
      </div>

      {/* Diagnosis */}
      {analysis.diagnosis && (
        <div className="bg-medical-50 dark:bg-medical-900/10 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <Activity className="h-5 w-5 text-medical-600 dark:text-medical-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Diagnóstico
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.diagnosis}</p>
              {analysis.cid10 && (
                <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded bg-medical-600 text-white">
                  CID-10: {analysis.cid10}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Symptoms */}
      <SymptomsSection symptoms={analysis.symptoms} />

      {/* Suggested Exams */}
      <ExamsSection exams={analysis.suggestedExams} />

      {/* Suggested Medications */}
      <MedicationsSection medications={analysis.suggestedMedications} />

      {/* Notes */}
      {analysis.notes && <NotesSection notes={analysis.notes} />}

      {/* Modal de Confirmação */}
      <ConfirmAnalysisModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

const SymptomsSection = ({ symptoms }: { symptoms: string[] }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Sintomas Identificados
      </h4>
    </div>
    <ul className="space-y-2">
      {symptoms.map((symptom, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-orange-500 mt-0.5">•</span>
          <span>{symptom}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ExamsSection = ({
  exams,
}: {
  exams: Array<{
    nome: string;
    motivo: string;
    prioridade: "urgente" | "alta" | "media" | "baixa" | "rotina";
  }>;
}) => {
  const priorityColors = {
    urgente: "border-critical-500 bg-critical-50 dark:bg-critical-900/10",
    alta: "border-alert-500 bg-alert-50 dark:bg-alert-900/10",
    media: "border-warning-500 bg-warning-50 dark:bg-warning-900/10",
    baixa: "border-health-500 bg-health-50 dark:bg-health-900/10",
    rotina: "border-medical-500 bg-medical-50 dark:bg-medical-900/10",
  };

  const priorityBadgeColors = {
    urgente: "bg-critical-600 text-white",
    alta: "bg-alert-600 text-white",
    media: "bg-warning-600 text-white",
    baixa: "bg-health-600 text-white",
    rotina: "bg-medical-600 text-white",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Exames Sugeridos</h4>
      </div>
      <div className="space-y-3">
        {exams.map((exam, index) => (
          <div
            key={index}
            className={`border-l-4 rounded-r-lg p-3 ${priorityColors[exam.prioridade]}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{exam.nome}</h5>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  priorityBadgeColors[exam.prioridade]
                }`}
              >
                {exam.prioridade.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{exam.motivo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MedicationsSection = ({
  medications,
}: {
  medications: Array<{
    nome: string;
    dosagem: string;
    via: string;
    frequencia: string;
    duracao: string;
    observacoes?: string;
  }>;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Pill className="h-5 w-5 text-green-600 dark:text-green-400" />
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Medicamentos Sugeridos
      </h4>
    </div>
    <div className="space-y-3">
      {medications.map((med, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{med.nome}</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dosagem:</span>
              <p className="text-gray-900 dark:text-white font-medium">{med.dosagem}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Via:</span>
              <p className="text-gray-900 dark:text-white font-medium capitalize">{med.via}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Frequência:</span>
              <p className="text-gray-900 dark:text-white font-medium">{med.frequencia}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Duração:</span>
              <p className="text-gray-900 dark:text-white font-medium">{med.duracao}</p>
            </div>
          </div>
          {med.observacoes && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Observações:</span>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{med.observacoes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const NotesSection = ({ notes }: { notes: string }) => {
  // Função auxiliar para quebrar conteúdo em itens legíveis
  const parseContentToItems = (content: string): string[] => {
    // Remove marcações de negrito
    const cleanContent = content.replace(/\*\*/g, "");

    // Tenta dividir por números seguidos de ponto (1., 2., etc.)
    const numberedItems = cleanContent.match(/\d+\.\s+[^.]+\./g);
    if (numberedItems && numberedItems.length > 1) {
      return numberedItems.map((item) => item.trim());
    }

    // Tenta dividir por sentenças (ponto final seguido de espaço e letra maiúscula)
    const sentences = cleanContent.split(/\.\s+(?=[A-Z])/);
    if (sentences.length > 1) {
      return sentences
        .map((s) => s.trim())
        .filter((s) => s.length > 20) // Ignora sentenças muito curtas
        .map((s) => (s.endsWith(".") ? s : s + "."));
    }

    // Se o texto for muito longo (>200 chars), tenta quebrar por vírgulas ou pontos-e-vírgulas
    if (cleanContent.length > 200) {
      const parts = cleanContent.split(/[,;]\s+/);
      if (parts.length > 2) {
        return parts.map((p, i) => {
          const trimmed = p.trim();
          // Adiciona pontuação se necessário
          if (i === parts.length - 1) {
            return trimmed.endsWith(".") ? trimmed : trimmed + ".";
          }
          return trimmed.endsWith(".") || trimmed.endsWith(",") || trimmed.endsWith(";")
            ? trimmed
            : trimmed + ",";
        });
      }
    }

    // Último recurso: retorna como item único
    return [cleanContent];
  };

  // Usa useMemo para processar as notas
  const sections = useMemo(() => {
    const result: Array<{ title: string; items: string[] }> = [];
    const text = String(notes); // Cria uma cópia da string

    // Padrão para detectar títulos em negrito (ex: **Título:**)
    const boldTitleRegex = /\*\*([^*]+):\*\*/g;
    const matches = Array.from(text.matchAll(boldTitleRegex));

    if (matches.length > 0) {
      matches.forEach((match, index) => {
        const title = match[1].trim();
        const startIndex = match.index! + match[0].length;
        const endIndex = matches[index + 1]?.index || text.length;
        const content = text.substring(startIndex, endIndex).trim();

        // Quebra o conteúdo em itens
        const items = parseContentToItems(content);
        result.push({ title, items });
      });

      // Adiciona texto antes do primeiro título, se houver
      if (matches[0].index! > 0) {
        const introText = text.substring(0, matches[0].index!).trim();
        if (introText) {
          result.unshift({
            title: "Resumo",
            items: parseContentToItems(introText),
          });
        }
      }
    } else {
      // Se não houver títulos, divide por números (1., 2., 3., etc.)
      const numberedRegex = /(\d+)\.\s+\*\*([^*]+):\*\*/g;
      const numberedMatches = Array.from(text.matchAll(numberedRegex));

      if (numberedMatches.length > 0) {
        numberedMatches.forEach((match, index) => {
          const number = match[1];
          const title = match[2].trim();
          const startIndex = match.index! + match[0].length;
          const endIndex = numberedMatches[index + 1]?.index || text.length;
          const content = text.substring(startIndex, endIndex).trim();

          const items = parseContentToItems(content);
          result.push({ title: `${number}. ${title}`, items });
        });

        // Adiciona texto antes do primeiro item numerado
        if (numberedMatches[0].index! > 0) {
          const introText = text.substring(0, numberedMatches[0].index!).trim();
          if (introText) {
            result.unshift({
              title: "Resumo",
              items: parseContentToItems(introText),
            });
          }
        }
      } else {
        // Fallback: divide o texto em sentenças
        result.push({ title: "Notas", items: parseContentToItems(text) });
      }
    }

    return result;
  }, [notes]);

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Notas Clínicas</h4>
      <div className="space-y-3">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title !== "Notas" && (
              <h5 className="text-sm font-semibold text-medical-700 dark:text-medical-400 mb-2">
                {section.title}
              </h5>
            )}
            <div className="grid gap-2">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-200 dark:border-gray-700/50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
