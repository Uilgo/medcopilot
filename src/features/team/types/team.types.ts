/**
 * Tipos para feature de Equipe
 */

export type MemberRole = "owner" | "admin" | "professional" | "staff";
export type MemberStatus = "active" | "inactive" | "pending";
export type InviteStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface TeamMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: string;
  updated_at: string;
  // Dados do usuário (JOIN)
  user: {
    id: string;
    nome: string;
    email: string;
    avatar_url: string | null;
    especialidade: string | null;
    crm: string | null;
  };
}

export interface TeamInvite {
  id: string;
  workspace_id: string;
  email: string;
  role: MemberRole;
  status: InviteStatus;
  invited_by: string;
  invited_at: string;
  expires_at: string;
  accepted_at: string | null;
  // Dados de quem convidou (JOIN)
  inviter: {
    nome: string;
    email: string;
  };
}

export interface CreateInviteInput {
  email: string;
  role: MemberRole;
}

export interface UpdateMemberRoleInput {
  role: MemberRole;
}

export interface RolePermissions {
  role: MemberRole;
  label: string;
  description: string;
  permissions: string[];
  color: string;
}
