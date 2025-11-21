/**
 * Utilitário para upload de imagens via API backend
 */

import api from "@/lib/axios";

export interface UploadImageOptions {
  type: "avatar" | "logo";
  file: File;
  workspaceId?: string; // Para upload de logo após onboarding
}

export const uploadImage = async ({
  type,
  file,
  workspaceId,
}: UploadImageOptions): Promise<string | null> => {
  try {
    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Tipo de arquivo não permitido:", file.type);
      return null;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("Arquivo muito grande:", file.size);
      return null;
    }

    // Criar FormData
    const formData = new FormData();
    formData.append(type, file);

    // Adicionar workspace_id se for upload de logo
    if (type === "logo" && workspaceId) {
      formData.append("workspace_id", workspaceId);
    }

    // Fazer upload via API
    const endpoint = type === "avatar" ? "/auth/upload-avatar" : "/auth/upload-logo";
    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Retornar URL
    const urlKey = `${type}_url`;
    return response.data.data[urlKey] || null;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return null;
  }
};
