/**
 * WorkspaceDataStep Component
 * Step 2: Dados da Clínica/Workspace
 */

import { useState, useEffect } from "react";
import { Building2, Hash, ExternalLink, Phone, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { maskPhone } from "@/utils/masks";
import { checkSlugAvailability } from "../api/checkSlugAvailability";
import type { UseFormRegister, FieldErrors, UseFormWatch, Control } from "react-hook-form";
import type { OnboardingInput } from "@/schemas/onboarding.schema";

interface WorkspaceDataStepProps {
  register: UseFormRegister<OnboardingInput>;
  errors: FieldErrors<OnboardingInput>;
  watch: UseFormWatch<OnboardingInput>;
  control: Control<OnboardingInput>;
  onLogoChange?: (file: File | null) => void;
}

export const WorkspaceDataStep = ({
  register,
  errors,
  watch,
  control,
  onLogoChange,
}: WorkspaceDataStepProps) => {
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">(
    "idle"
  );
  const slugValue = watch("slug");

  // Verificar disponibilidade do slug
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!slugValue || slugValue.length < 2) {
        setSlugStatus("idle");
        return;
      }

      setSlugStatus("checking");
      const isAvailable = await checkSlugAvailability(slugValue);
      setSlugStatus(isAvailable ? "available" : "unavailable");
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [slugValue]);

  const handleLogoChange = (file: File | null) => {
    // Passa o arquivo para o componente pai
    onLogoChange?.(file);
    // Marca como pendente no formulário (não é um campo do schema, mas podemos adicionar)
  };

  const normalizeSlug = (value: string) => {
    let result = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

    // Substitui espaços e caracteres especiais por hífens, mas mantém hífens existentes
    result = result.replace(/[^a-z0-9-]/g, "-");

    // Remove múltiplos hífens consecutivos
    result = result.replace(/-{2,}/g, "-");

    return result;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
      {/* Coluna Esquerda - Logo */}
      <div className="flex justify-center lg:justify-start">
        <AvatarUpload
          id="workspace-logo"
          name="workspace-logo"
          label="Logo da Clínica"
          type="company"
          onChange={handleLogoChange}
          error={errors.logo_url?.message}
        />
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="space-y-2">
        <Input
          label="Nome da Clínica *"
          type="text"
          placeholder="Clínica Exemplo"
          leftIcon={Building2}
          autoComplete="organization"
          error={errors.nome?.message}
          {...register("nome")}
        />

        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <label
              htmlFor="slug"
              className="text-sm font-medium text-gray-900 dark:text-white shrink-0"
            >
              Slug (URL Única) *
            </label>
            {watch("slug") && (
              <div
                className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-help"
                title={`app.medcopilot.com/${watch("slug")}`}
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">
                  Sua URL:{" "}
                  <span className="font-medium text-medical-600 dark:text-medical-400">
                    app.medcopilot.com/
                    {watch("slug").length > 20
                      ? watch("slug").substring(0, 20) + "..."
                      : watch("slug")}
                  </span>
                </span>
              </div>
            )}
          </div>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                id="slug"
                type="text"
                placeholder="clinica-exemplo"
                leftIcon={Hash}
                autoComplete="off"
                error={
                  errors.slug?.message ||
                  (slugStatus === "unavailable" ? "Este slug já está em uso" : undefined)
                }
                value={field.value || ""}
                maxLength={30}
                onChange={(e) => {
                  const normalized = normalizeSlug(e.target.value);
                  field.onChange(normalized);
                }}
                onBlur={field.onBlur}
                rightElement={
                  slugValue && slugValue.length >= 2 ? (
                    <>
                      {slugStatus === "checking" && (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      )}
                      {slugStatus === "available" && (
                        <CheckCircle2 className="w-5 h-5 text-health-600 dark:text-health-400" />
                      )}
                      {slugStatus === "unavailable" && (
                        <XCircle className="w-5 h-5 text-critical-600 dark:text-critical-400" />
                      )}
                    </>
                  ) : undefined
                }
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Input
            label="Telefone/WhatsApp Principal *"
            type="tel"
            placeholder="(11) 98765-4321"
            leftIcon={Phone}
            autoComplete="tel"
            maxLength={15}
            error={errors.telefone_principal?.message}
            {...register("telefone_principal", {
              onChange: (e) => {
                e.target.value = maskPhone(e.target.value);
              },
            })}
          />

          <Input
            label="Telefone Residencial"
            type="tel"
            placeholder="(11) 3456-7890"
            leftIcon={Phone}
            autoComplete="tel"
            maxLength={15}
            error={errors.telefone_residencial?.message}
            {...register("telefone_residencial", {
              onChange: (e) => {
                e.target.value = maskPhone(e.target.value);
              },
            })}
          />
        </div>

        <Textarea
          label="Descrição"
          placeholder="Descreva sua clínica ou consultório..."
          rows={3}
          error={errors.descricao?.message}
          {...register("descricao")}
        />
      </div>
    </div>
  );
};
