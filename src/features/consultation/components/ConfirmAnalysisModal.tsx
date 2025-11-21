/**
 * Modal de confirmação para atualizar análise
 * Evita perda acidental da análise atual
 */

import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Modal, ModalContent } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isAnalyzing?: boolean;
}

export const ConfirmAnalysisModal = ({
  isOpen,
  onClose,
  onConfirm,
  isAnalyzing = false,
}: ConfirmAnalysisModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="max-w-2xl w-full min-w-[580px] p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-alert-100 dark:bg-alert-900/20">
              <AlertTriangle className="h-5 w-5 text-alert-600 dark:text-alert-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Atualizar Análise
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Confirme esta ação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-5">
          <div className="bg-alert-50 dark:bg-alert-900/10 border border-alert-200 dark:border-alert-800 rounded-lg p-4">
            <p className="text-xs text-alert-800 dark:text-alert-200 font-medium mb-2">
              ⚠️ Atenção: A análise atual será substituída
            </p>
            <p className="text-xs text-alert-700 dark:text-alert-300 leading-relaxed">
              Ao confirmar, a análise de IA atual será descartada e uma nova análise será gerada com
              base nas mensagens mais recentes da consulta.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
              O que será feito:
            </h4>
            <ul className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-medical-500 mt-0.5">✓</span>
                <span className="leading-relaxed">
                  Nova análise será gerada com todas as mensagens da consulta
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-medical-500 mt-0.5">✓</span>
                <span className="leading-relaxed">
                  Diagnóstico, exames e medicamentos serão atualizados
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-medical-500 mt-0.5">✓</span>
                <span className="leading-relaxed">Notas clínicas serão recalculadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical-500 mt-0.5">✗</span>
                <span className="font-medium leading-relaxed">
                  A análise anterior será perdida permanentemente
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-medical-50 dark:bg-medical-900/10 border border-medical-200 dark:border-medical-800 rounded-lg p-3">
            <p className="text-xs text-medical-700 dark:text-medical-300 leading-relaxed">
              💡 <strong>Dica:</strong> Use esta função quando adicionar novas informações
              importantes à consulta e precisar de uma análise atualizada.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1" disabled={isAnalyzing}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="warning"
            className="flex-1"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Confirmar Atualização
              </>
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
