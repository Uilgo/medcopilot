/**
 * Hook para gerenciar convites da equipe
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/lib/axios";
import type { TeamInvite, CreateInviteInput } from "../types/team.types";
import { teamKeys } from "./useTeamMembers";

// Hook para listar convites
export function useTeamInvites() {
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useQuery({
    queryKey: teamKeys.invites(slug),
    queryFn: async () => {
      const { data } = await api.get(`/${slug}/team/invites`);
      return (data.data || data) as TeamInvite[];
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para criar convite
export function useCreateInvite() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const { data } = await api.post(`/${slug}/team/invites`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.invites(slug) });
    },
  });
}

// Hook para cancelar convite
export function useCancelInvite() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { data } = await api.patch(`/${slug}/team/invites/${inviteId}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.invites(slug) });
    },
  });
}

// Hook para reenviar convite
export function useResendInvite() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { data } = await api.post(`/${slug}/team/invites/${inviteId}/resend`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.invites(slug) });
    },
  });
}
