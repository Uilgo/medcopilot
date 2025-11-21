/**
 * Tab de Membros da Equipe
 */

import { useState } from "react";
import { MoreHorizontal, Shield, User, Mail, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/Dropdown";
import {
  useTeamMembers,
  useUpdateMemberRole,
  useDeactivateMember,
  useReactivateMember,
  useRemoveMember,
} from "../hooks/useTeamMembers";
import type { MemberRole } from "../types/team.types";
import { toast } from "sonner";

const roleLabels: Record<MemberRole, string> = {
  owner: "Proprietário",
  admin: "Administrador",
  professional: "Profissional",
  staff: "Equipe",
};

const roleColors: Record<MemberRole, string> = {
  owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  professional: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  staff: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export function MembersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: members = [], isLoading, refetch, isRefetching } = useTeamMembers();
  const updateRole = useUpdateMemberRole();
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();
  const remove = useRemoveMember();

  const filteredMembers = members.filter(
    (member) =>
      member.user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateRole = async (memberId: string, role: MemberRole) => {
    try {
      await updateRole.mutateAsync({ memberId, role });
      toast.success("Permissão atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar permissão");
    }
  };

  const handleDeactivate = async (memberId: string) => {
    try {
      await deactivate.mutateAsync(memberId);
      toast.success("Membro desativado com sucesso!");
    } catch {
      toast.error("Erro ao desativar membro");
    }
  };

  const handleReactivate = async (memberId: string) => {
    try {
      await reactivate.mutateAsync(memberId);
      toast.success("Membro reativado com sucesso!");
    } catch {
      toast.error("Erro ao reativar membro");
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Tem certeza que deseja remover este membro? Esta ação não pode ser desfeita.")) {
      return;
    }
    try {
      await remove.mutateAsync(memberId);
      toast.success("Membro removido com sucesso!");
    } catch {
      toast.error("Erro ao remover membro");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Input
          leftIcon={User}
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm min-w-[280px]"
        />
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{filteredMembers.length}</strong> membros
          </div>
          <Button onClick={() => refetch()} variant="outline" size="md" disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Lista de Membros */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum membro encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Avatar */}
              <div className="shrink-0">
                {member.user.avatar_url ? (
                  <img
                    src={member.user.avatar_url}
                    alt={member.user.nome}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center">
                    <User className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {member.user.nome}
                  </h3>
                  {member.status === "inactive" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      Inativo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.user.email}
                  </span>
                  {member.user.especialidade && (
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {member.user.especialidade}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Desde {new Date(member.joined_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    roleColors[member.role]
                  }`}
                >
                  {roleLabels[member.role]}
                </span>
              </div>

              {/* Actions */}
              {member.role !== "owner" && (
                <Dropdown
                  align="right"
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownLabel>Alterar Permissão</DropdownLabel>
                  <DropdownItem onClick={() => handleUpdateRole(member.id, "admin")}>
                    Administrador
                  </DropdownItem>
                  <DropdownItem onClick={() => handleUpdateRole(member.id, "professional")}>
                    Profissional
                  </DropdownItem>
                  <DropdownItem onClick={() => handleUpdateRole(member.id, "staff")}>
                    Equipe
                  </DropdownItem>
                  <DropdownSeparator />
                  {member.status === "active" ? (
                    <DropdownItem onClick={() => handleDeactivate(member.id)}>
                      Desativar
                    </DropdownItem>
                  ) : (
                    <DropdownItem onClick={() => handleReactivate(member.id)}>
                      Reativar
                    </DropdownItem>
                  )}
                  <DropdownSeparator />
                  <DropdownItem variant="danger" onClick={() => handleRemove(member.id)}>
                    Remover da Equipe
                  </DropdownItem>
                </Dropdown>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
