import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { PatientListResponse, CreatePatientInput, UpdatePatientInput } from "../types";
import { useParams } from "react-router-dom";

// Chaves para cache do React Query
export const patientKeys = {
  all: (workspaceSlug: string) => ["patients", workspaceSlug] as const,
  lists: (workspaceSlug: string) => [...patientKeys.all(workspaceSlug), "list"] as const,
  list: (workspaceSlug: string, filters: string) =>
    [...patientKeys.lists(workspaceSlug), { filters }] as const,
  details: (workspaceSlug: string) => [...patientKeys.all(workspaceSlug), "detail"] as const,
  detail: (workspaceSlug: string, id: string) =>
    [...patientKeys.details(workspaceSlug), id] as const,
};

// Hook para listar pacientes
export function usePatients(page = 1, limit = 10, search = "") {
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "default"; // Fallback seguro

  return useQuery({
    queryKey: patientKeys.list(slug, JSON.stringify({ page, limit, search })),
    queryFn: async () => {
      const params: { page: number; limit: number; search?: string } = { page, limit };
      if (search) {
        params.search = search;
      }

      const { data } = await api.get<PatientListResponse>(`/${slug}/patients`, {
        params,
      });

      return data;
    },
    staleTime: 1000 * 60 * 10, // Cache por 10 minutos (pacientes mudam pouco)
    gcTime: 1000 * 60 * 30, // Mantém em cache por 30 minutos
    refetchOnWindowFocus: false, // Não recarrega ao focar na janela
    refetchOnMount: true, // ✅ Recarrega ao montar se dados estiverem stale
    enabled: !!slug && slug !== "default", // ✅ Só faz requisição se tiver workspace válido
  });
}

// Hook para criar paciente
export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "default";

  return useMutation({
    mutationFn: async (newPatient: CreatePatientInput) => {
      const { data } = await api.post(`/${slug}/patients`, newPatient);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists(slug) });
    },
  });
}

// Hook para atualizar paciente
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "default";

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePatientInput }) => {
      const { data: response } = await api.patch(`/${slug}/patients/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists(slug) });
    },
  });
}

// Hook para remover paciente
export function useDeletePatient() {
  const queryClient = useQueryClient();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();
  const slug = workspace_slug || "default";

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/${slug}/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists(slug) });
    },
  });
}
