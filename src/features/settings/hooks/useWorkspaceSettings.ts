/**
 * Hook para gerenciar configurações do workspace
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/lib/axios";
import type {
  WorkspaceSettings,
  WorkspaceSettingsResponse,
  UpdateWorkspaceSettingsInput,
} from "../types/settings.types";

// Chaves para cache
export const settingsKeys = {
  all: (workspaceSlug: string) => ["settings", workspaceSlug] as const,
  detail: (workspaceSlug: string) => [...settingsKeys.all(workspaceSlug), "detail"] as const,
};

// Hook para buscar configurações
export function useWorkspaceSettings(): UseQueryResult<WorkspaceSettings, Error> {
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useQuery({
    queryKey: settingsKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<WorkspaceSettingsResponse>(`/${slug}/settings`);
      return data.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para atualizar configurações
export function useUpdateWorkspaceSettings(): UseMutationResult<
  unknown,
  Error,
  UpdateWorkspaceSettingsInput,
  unknown
> {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (input: UpdateWorkspaceSettingsInput) => {
      const { data } = await api.patch(`/${slug}/settings`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all(slug) });
    },
  });
}

// Hook para atualizar logo
export function useUpdateWorkspaceLogo(): UseMutationResult<unknown, Error, File, unknown> {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "";

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);

      const { data } = await api.patch(`/${slug}/settings/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all(slug) });
    },
  });
}
