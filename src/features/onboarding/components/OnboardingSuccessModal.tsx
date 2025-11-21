/**
 * OnboardingSuccessModal Component
 * Modal de sucesso exibido após conclusão do onboarding
 */

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface OnboardingSuccessModalProps {
  open: boolean;
  onClose?: () => void;
}

export const OnboardingSuccessModal = ({ open, onClose }: OnboardingSuccessModalProps) => {
  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay com animação */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal com animação */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md min-w-[400px] bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brilho sutil no topo */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-medical-500/20 to-transparent" />

          {/* Header */}
          <div className="flex flex-col space-y-3 p-8 text-center">
            {/* Ícone com animação */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                {/* Círculo de fundo com pulso */}
                <div className="absolute inset-0 bg-health-500/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-linear-to-br from-health-100 to-health-50 dark:from-health-900/30 dark:to-health-900/10 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-health-600 dark:text-health-400 animate-in zoom-in duration-500" />
                </div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Cadastro Concluído!
            </h2>

            {/* Descrição */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed px-4">
              Seu onboarding foi finalizado com sucesso. Você será redirecionado para o dashboard em
              instantes...
            </p>
          </div>

          {/* Body com loading */}
          <div className="flex flex-col items-center gap-3 pb-8">
            <Loader2 className="w-7 h-7 text-medical-600 dark:text-medical-400 animate-spin" />
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
              Preparando seu ambiente...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
