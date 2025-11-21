/**
 * Formulário de Configurações do Workspace
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Building2, Phone, MapPin, Upload, Loader2, Save, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { WorkspaceSettings } from "../types/settings.types";
import { useUpdateWorkspaceSettings, useUpdateWorkspaceLogo } from "../hooks/useWorkspaceSettings";
import { SettingsSection } from "./SettingsSection";

const settingsSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  telefone_principal: z.string().min(10, "Telefone inválido"),
  telefone_residencial: z.string().optional(),
  endereco: z.object({
    cep: z.string().min(8, "CEP inválido"),
    estado: z.string().min(2, "Estado inválido"),
    cidade: z.string().min(3, "Cidade inválida"),
    bairro: z.string().min(3, "Bairro inválido"),
    rua: z.string().min(3, "Rua inválida"),
    numero: z.string().min(1, "Número inválido"),
    complemento: z.string().optional(),
    referencia: z.string().optional(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: WorkspaceSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const updateSettings = useUpdateWorkspaceSettings();
  const updateLogo = useUpdateWorkspaceLogo();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      nome: settings.nome,
      descricao: settings.descricao || "",
      telefone_principal: settings.telefone_principal,
      telefone_residencial: settings.telefone_residencial || "",
      endereco: settings.endereco,
    },
  });

  useEffect(() => {
    reset({
      nome: settings.nome,
      descricao: settings.descricao || "",
      telefone_principal: settings.telefone_principal,
      telefone_residencial: settings.telefone_residencial || "",
      endereco: settings.endereco,
    });
  }, [settings, reset]);

  // Usar o logo do settings se não houver preview
  const displayLogo = logoPreview || settings.logo_url;

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettings.mutateAsync(data);
      toast.success("Configurações atualizadas com sucesso!");
    } catch {
      toast.error("Erro ao atualizar configurações");
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 2MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      await updateLogo.mutateAsync(file);
      toast.success("Logo atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar logo");
      setLogoPreview(undefined); // Volta para o logo original
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Header com Ações Flutuantes (opcional, ou manter no final) */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda - Identidade Visual e Dados Básicos */}
        <div className="space-y-8 lg:col-span-2">
          {/* Identidade Visual */}
          <SettingsSection
            title="Identidade Visual"
            description="Gerencie o logo e a aparência da sua clínica"
            icon={ImageIcon}
          >
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors group-hover:border-primary/50">
                  {displayLogo ? (
                    <img src={displayLogo} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 active:scale-95">
                      {updateLogo.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                    disabled={updateLogo.isPending}
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Logo da Clínica
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Recomendamos uma imagem quadrada (PNG ou JPG) com fundo transparente. Tamanho
                  máximo: 2MB.
                </p>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    disabled={updateLogo.isPending}
                  >
                    Selecionar Arquivo
                  </Button>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setLogoPreview(undefined)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Dados Gerais */}
          <SettingsSection
            title="Informações da Clínica"
            description="Dados principais exibidos nos documentos e cabeçalhos"
            icon={Building2}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Nome da Clínica <span className="text-red-500">*</span>
                </label>
                <Input {...register("nome")} error={errors.nome?.message} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Descrição / Slogan
                </label>
                <Input
                  {...register("descricao")}
                  error={errors.descricao?.message}
                  placeholder="Ex: Excelência em cardiologia"
                />
              </div>
            </div>
          </SettingsSection>

          {/* Endereço */}
          <SettingsSection
            title="Endereço e Localização"
            description="Endereço físico da clínica para correspondências e receitas"
            icon={MapPin}
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  CEP <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("endereco.cep")}
                  error={errors.endereco?.cep?.message}
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <Input {...register("endereco.cidade")} error={errors.endereco?.cidade?.message} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  UF <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("endereco.estado")}
                  error={errors.endereco?.estado?.message}
                  maxLength={2}
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Rua / Logradouro <span className="text-red-500">*</span>
                </label>
                <Input {...register("endereco.rua")} error={errors.endereco?.rua?.message} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Número <span className="text-red-500">*</span>
                </label>
                <Input {...register("endereco.numero")} error={errors.endereco?.numero?.message} />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Bairro <span className="text-red-500">*</span>
                </label>
                <Input {...register("endereco.bairro")} error={errors.endereco?.bairro?.message} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Complemento
                </label>
                <Input
                  {...register("endereco.complemento")}
                  error={errors.endereco?.complemento?.message}
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Ponto de Referência
                </label>
                <Input
                  {...register("endereco.referencia")}
                  error={errors.endereco?.referencia?.message}
                />
              </div>
            </div>
          </SettingsSection>
        </div>

        {/* Coluna Direita - Contato e Dados Fixos */}
        <div className="space-y-8">
          {/* Contato */}
          <SettingsSection
            title="Canais de Contato"
            description="Telefones para agendamento e contato"
            icon={Phone}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Telefone Principal <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("telefone_principal")}
                  error={errors.telefone_principal?.message}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Telefone Secundário
                </label>
                <Input
                  {...register("telefone_residencial")}
                  error={errors.telefone_residencial?.message}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Barra de Ações Fixa ou Flutuante */}
      <div className="sticky bottom-6 z-10 flex justify-end gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg animate-in slide-in-from-bottom-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => reset()}
          disabled={!isDirty || updateSettings.isPending}
          className="hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4 mr-2" />
          Descartar
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || updateSettings.isPending}
          className="bg-linear-to-r from-primary to-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
