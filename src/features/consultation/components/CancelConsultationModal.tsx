/**
 * CancelConsultationModal
 * Modal de confirmação para cancelar consulta
 */

import { AlertTriangle } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface CancelConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  messagesCount: number;
}

export const CancelConsultationModal = ({
  isOpen,
  onClose,
  onConfirm,
  messagesCount,
}: CancelConsultationModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-critical-100 dark:bg-critical-900/20">
              <AlertTriangle className="h-6 w-6 text-critical-600 dark:text-critical-400" />
            </div>
            <ModalTitle>Cancelar Consulta?</ModalTitle>
          </div>
          <ModalDescription>
            Tem certeza que deseja cancelar esta consulta?{" "}
            {messagesCount > 0 && (
              <span className="font-medium text-critical-600 dark:text-critical-400">
                {messagesCount} {messagesCount === 1 ? "mensagem" : "mensagens"} e todos os dados
                serão perdidos permanentemente.
              </span>
            )}
            {messagesCount === 0 && (
              <span className="font-medium">Todos os dados serão perdidos permanentemente.</span>
            )}
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button
            variant="error"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Sim, Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
