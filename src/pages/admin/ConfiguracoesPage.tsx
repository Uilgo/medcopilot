/**
 * ConfiguracoesPage
 * Página de configurações do workspace (ADMIN only)
 */

import { useEffect } from "react";
import { usePageStore } from "@/store/usePageStore";
import { useWorkspaceSettings } from "@/features/settings/hooks/useWorkspaceSettings";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { Loader2, AlertCircle } from "lucide-react";

export const ConfiguracoesPage = () => {
  const { setPageInfo } = usePageStore();
  const { data: settings, isLoading, error } = useWorkspaceSettings();

  useEffect(() => {
    setPageInfo("Configurações", "Gerencie as configurações do seu workspace");
  }, [setPageInfo]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="font-semibold text-lg">Erro ao carregar</h3>
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar as configurações
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="w-full">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
};
