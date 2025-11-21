/**
 * Modal de confirmação para deletar mensagem de transcrição
 */

import { AlertTriangle } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  messagePreview: string;
}

export const DeleteMessageModal = ({
  isOpen,
  onClose,
  onConfirm,
  messagePreview,
}: DeleteMessageModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent onClose={onClose} className="min-w-[420px] max-w-md">
        <ModalHeader>
          <ModalTitle>Deletar Transcrição</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Warning Icon */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-critical-100 dark:bg-critical-900/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-critical-600 dark:text-critical-400" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tem certeza que deseja deletar esta transcrição?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta ação não pode ser desfeita. A mensagem será removida permanentemente da
                consulta.
              </p>
            </div>

            {/* Message Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Conteúdo da mensagem:</p>
              <p className="text-sm text-gray-900 dark:text-white line-clamp-3">{messagePreview}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleConfirm} variant="error" className="flex-1">
                Deletar
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
