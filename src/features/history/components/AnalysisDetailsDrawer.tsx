/**
 * Drawer de Detalhes da Análise de IA
 */

import { Drawer } from "@/components/ui/Drawer";
import {
  User,
  Calendar,
  Clock,
  Activity,
  Sparkles,
  Stethoscope,
  Pill,
  AlertCircle,
} from "lucide-react";
import type { AnalysisHistory } from "../hooks/useAnalysisHistory";

interface AnalysisDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisHistory | null;
}

export const AnalysisDetailsDrawer = ({
  isOpen,
  onClose,
  analysis,
}: AnalysisDetailsDrawerProps) => {
  if (!analysis) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-critical-100 dark:bg-critical-900/20 text-critical-700 dark:text-critical-400";
      case "alta":
        return "bg-alert-100 dark:bg-alert-900/20 text-alert-700 dark:text-alert-400";
      case "media":
        return "bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400";
      case "baixa":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "Urgente";
      case "alta":
        return "Alta";
      case "media":
        return "Média";
      case "baixa":
        return "Baixa";
      case "rotina":
        return "Rotina";
      default:
        return priority;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Análise de IA Completa" size="lg">
      <div className="space-y-6">
        {/* Header com Confiança */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-medical-600 dark:text-medical-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Modelo: {analysis.modelo_ia}
            </span>
          </div>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-medical-100 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400">
            {analysis.confidence}% de confiança
          </span>
        </div>

        {/* Informações da Consulta */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-medical-600 dark:text-medical-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Informações da Consulta</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Paciente:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {analysis.consulta.paciente.nome}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Queixa Principal:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {analysis.consulta.queixa_principal || "Não informada"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(analysis.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {new Date(analysis.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-medical-50 dark:bg-medical-900/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-medical-600 dark:text-medical-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Diagnóstico</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {analysis.diagnosis}
          </p>
          {analysis.cid10 && (
            <span className="inline-block px-3 py-1 rounded-lg bg-medical-600 text-white text-sm font-medium">
              CID-10: {analysis.cid10}
            </span>
          )}
        </div>

        {/* Sintomas */}
        {analysis.symptoms.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Sintomas Identificados
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exames Sugeridos */}
        {analysis.suggestedExams.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Exames Sugeridos ({analysis.suggestedExams.length})
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.suggestedExams.map((exam, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{exam.nome}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        exam.prioridade
                      )}`}
                    >
                      {getPriorityLabel(exam.prioridade)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exam.justificativa}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medicamentos Sugeridos */}
        {analysis.suggestedMedications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pill className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Medicamentos Sugeridos ({analysis.suggestedMedications.length})
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.suggestedMedications.map((med, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{med.nome}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Dosagem:</span>
                      <p className="text-gray-900 dark:text-white">{med.dosagem}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Frequência:</span>
                      <p className="text-gray-900 dark:text-white">{med.frequencia}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Duração:</span>
                      <p className="text-gray-900 dark:text-white">{med.duracao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notas Clínicas */}
        {analysis.notas_clinicas && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Notas Clínicas</h3>
            <div className="space-y-3">
              {(() => {
                // Divide o texto em sentenças
                const sentences = analysis.notas_clinicas
                  .split(/\.\s+/)
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0);

                return sentences.map((sentence, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {sentence}
                      {sentence.endsWith(".") ? "" : "."}
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
