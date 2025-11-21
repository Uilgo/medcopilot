/**
 * Tab de Convites da Equipe
 */

import { useState } from "react";
import { Mail, Send, X, RefreshCw, AlertCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/Modal";
import {
  useTeamInvites,
  useCreateInvite,
  useCancelInvite,
  useResendInvite,
} from "../hooks/useTeamInvites";
import type { MemberRole } from "../types/team.types";
import { toast } from "sonner";

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "professional", label: "Profissional" },
  { value: "staff", label: "Equipe" },
];

const statusLabels = {
  pending: "Pendente",
  accepted: "Aceito",
  expired: "Expirado",
  cancelled: "Cancelado",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  expired: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function InvitesTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("professional");

  const { data: invites = [], isLoading, refetch, isRefetching } = useTeamInvites();
  const createInvite = useCreateInvite();
  const cancelInvite = useCancelInvite();
  const resendInvite = useResendInvite();

  const handleCreateInvite = async () => {
    if (!email) {
      toast.error("Digite um email válido");
      return;
    }

    try {
      await createInvite.mutateAsync({ email, role });
      toast.success("Convite enviado com sucesso!");
      setIsModalOpen(false);
      setEmail("");
      setRole("professional");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Erro ao enviar convite");
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await cancelInvite.mutateAsync(inviteId);
      toast.success("Convite cancelado");
    } catch {
      toast.error("Erro ao cancelar convite");
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendInvite.mutateAsync(inviteId);
      toast.success("Convite reenviado!");
    } catch {
      toast.error("Erro ao reenviar convite");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>{invites.length}</strong> convites
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => refetch()} variant="outline" size="md" disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            <UserPlus className="h-4 w-4" />
            Convidar Membro
          </Button>
        </div>
      </div>

      {/* Lista de Convites */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600" />
        </div>
      ) : invites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum convite enviado ainda</p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-4">
            Enviar Primeiro Convite
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Icon */}
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {invite.email}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>Convidado por {invite.inviter.nome}</span>
                  <span>•</span>
                  <span>{new Date(invite.invited_at).toLocaleDateString("pt-BR")}</span>
                  {invite.status === "pending" && (
                    <>
                      <span>•</span>
                      <span>
                        Expira em {new Date(invite.expires_at).toLocaleDateString("pt-BR")}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[invite.status]
                  }`}
                >
                  {statusLabels[invite.status]}
                </span>
              </div>

              {/* Actions */}
              {invite.status === "pending" && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleResendInvite(invite.id)}
                    variant="outline"
                    size="sm"
                    disabled={resendInvite.isPending}
                  >
                    <Send className="h-4 w-4" />
                    Reenviar
                  </Button>
                  <Button
                    onClick={() => handleCancelInvite(invite.id)}
                    variant="ghost"
                    size="sm"
                    disabled={cancelInvite.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Novo Convite */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent onClose={() => setIsModalOpen(false)}>
          <ModalHeader>
            <ModalTitle>Convidar Novo Membro</ModalTitle>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
            />

            <Select
              label="Permissão"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateInvite}
                disabled={createInvite.isPending || !email}
              >
                {createInvite.isPending ? "Enviando..." : "Enviar Convite"}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
