/**
 * Hook para gerenciar membros da equipe
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/lib/axios";
import type { TeamMember, UpdateMemberRoleInput } from "../types/team.types";

// Chaves para cache
export const teamKeys = {
  all: (workspaceSlug: string) => ["team", workspaceSlug] as const,
  members: (workspaceSlug: string) => [...teamKeys.all(workspaceSlug), "members"] as const,
  invites: (workspaceSlug: string) => [...teamKeys.all(workspaceSlug), "invites"] as const,
};

// Hook para listar membros
export function useTeamMembers() {
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useQuery({
    queryKey: teamKeys.members(slug),
    queryFn: async () => {
      const { data } = await api.get(`/${slug}/team/members`);
      return (data.data || data) as TeamMember[];
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para atualizar role de membro
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: UpdateMemberRoleInput["role"];
    }) => {
      const { data } = await api.patch(`/${slug}/team/members/${memberId}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(slug) });
    },
  });
}

// Hook para desativar membro
export function useDeactivateMember() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await api.patch(`/${slug}/team/members/${memberId}/deactivate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(slug) });
    },
  });
}

// Hook para reativar membro
export function useReactivateMember() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await api.patch(`/${slug}/team/members/${memberId}/reactivate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(slug) });
    },
  });
}

// Hook para remover membro
export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (memberId: string) => {
      await api.delete(`/${slug}/team/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(slug) });
    },
  });
}
