/**
 * Tab de Permissões da Equipe
 */

import { Shield, Check } from "lucide-react";
import type { RolePermissions } from "../types/team.types";

const rolesPermissions: RolePermissions[] = [
  {
    role: "owner",
    label: "Proprietário",
    description: "Controle total do workspace. Não pode ser alterado.",
    color: "border-purple-500 bg-purple-50 dark:bg-purple-900/10",
    permissions: [
      "Gerenciar todos os membros e permissões",
      "Excluir o workspace",
      "Gerenciar assinatura e pagamentos",
      "Acessar todas as configurações",
      "Visualizar logs de auditoria",
      "Gerenciar integrações",
      "Todas as permissões de Admin",
    ],
  },
  {
    role: "admin",
    label: "Administrador",
    description: "Gerencia o workspace e a equipe.",
    color: "border-blue-500 bg-blue-50 dark:bg-blue-900/10",
    permissions: [
      "Convidar e remover membros",
      "Alterar permissões de membros",
      "Gerenciar pacientes",
      "Visualizar todas as consultas",
      "Gerenciar configurações gerais",
      "Todas as permissões de Profissional",
    ],
  },
  {
    role: "professional",
    label: "Profissional",
    description: "Profissional de saúde que realiza consultas.",
    color: "border-green-500 bg-green-50 dark:bg-green-900/10",
    permissions: [
      "Realizar consultas com IA",
      "Visualizar e editar pacientes",
      "Acessar histórico de consultas",
      "Gerar análises de IA",
      "Visualizar transcrições",
      "Todas as permissões de Equipe",
    ],
  },
  {
    role: "staff",
    label: "Equipe",
    description: "Membro da equipe com acesso limitado.",
    color: "border-gray-500 bg-gray-50 dark:bg-gray-900/10",
    permissions: [
      "Visualizar lista de pacientes",
      "Visualizar histórico de consultas",
      "Acessar dashboard",
    ],
  },
];

export function PermissionsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Sistema de Permissões
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Cada nível de permissão herda as permissões dos níveis inferiores. Apenas o
              Proprietário pode alterar permissões de Administradores.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Permissões */}
      <div className="grid gap-6">
        {rolesPermissions.map((rolePermission) => (
          <div
            key={rolePermission.role}
            className={`border-2 rounded-lg p-6 ${rolePermission.color}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {rolePermission.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {rolePermission.description}
                </p>
              </div>
              {rolePermission.role === "owner" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Você
                </span>
              )}
            </div>

            {/* Permissões */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Permissões:
              </h4>
              <ul className="space-y-2">
                {rolePermission.permissions.map((permission, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notas Importantes</h4>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>• Apenas o Proprietário pode transferir a propriedade do workspace</li>
          <li>• Administradores não podem alterar permissões de outros Administradores</li>
          <li>• Membros desativados perdem acesso imediatamente</li>
          <li>• Convites expiram após 7 dias</li>
        </ul>
      </div>
    </div>
  );
}
