/**
 * ProfessionalDataStep Component
 * Step 1: Dados Profissionais (Especialidade e CRM)
 */

import { useState, useEffect } from "react";
import { User, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { maskCrm, maskCpfCnpj } from "@/utils/masks";
import { checkCrmAvailability } from "../api/checkCrmAvailability";
import { checkCpfCnpjAvailability } from "../api/checkCpfCnpjAvailability";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { OnboardingInput } from "@/schemas/onboarding.schema";

interface ProfessionalDataStepProps {
  register: UseFormRegister<OnboardingInput>;
  errors: FieldErrors<OnboardingInput>;
  setValue: UseFormSetValue<OnboardingInput>;
  watch: UseFormWatch<OnboardingInput>;
  onAvatarChange?: (file: File | null) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ESPECIALIDADES_COMUNS = [
  { value: "custom", label: "+ Adicionar outra especialidade" },
  { value: "cardiologia", label: "Cardiologia" },
  { value: "pediatria", label: "Pediatria" },
  { value: "ginecologia", label: "Ginecologia e Obstetrícia" },
  { value: "ortopedia", label: "Ortopedia" },
  { value: "dermatologia", label: "Dermatologia" },
  { value: "psiquiatria", label: "Psiquiatria" },
  { value: "neurologia", label: "Neurologia" },
  { value: "oftalmologia", label: "Oftalmologia" },
  { value: "otorrinolaringologia", label: "Otorrinolaringologia" },
  { value: "urologia", label: "Urologia" },
  { value: "endocrinologia", label: "Endocrinologia" },
  { value: "gastroenterologia", label: "Gastroenterologia" },
  { value: "pneumologia", label: "Pneumologia" },
  { value: "reumatologia", label: "Reumatologia" },
  { value: "anestesiologia", label: "Anestesiologia" },
  { value: "radiologia", label: "Radiologia" },
  { value: "clinica_geral", label: "Clínica Geral" },
  { value: "medicina_familia", label: "Medicina de Família e Comunidade" },
];

export const ProfessionalDataStep = ({
  register,
  errors,
  setValue,
  watch,
  onAvatarChange,
  onValidationChange,
}: ProfessionalDataStepProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [crmStatus, setCrmStatus] = useState<"idle" | "checking" | "available" | "unavailable">(
    "idle"
  );
  const [cpfCnpjStatus, setCpfCnpjStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");

  const especialidadeValue = watch("especialidade");
  const crmValue = watch("crm");
  const cpfCnpjValue = watch("cpf_cnpj");

  // Verificar disponibilidade do CRM (debounce mínimo de 100ms)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!crmValue || crmValue.length < 7) {
        setCrmStatus("idle");
        return;
      }

      setCrmStatus("checking");
      const isAvailable = await checkCrmAvailability(crmValue);
      setCrmStatus(isAvailable ? "available" : "unavailable");
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [crmValue]);

  // Verificar disponibilidade do CPF/CNPJ (debounce mínimo de 100ms)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const digits = cpfCnpjValue?.replace(/\D/g, "") || "";
      if (digits.length < 11) {
        setCpfCnpjStatus("idle");
        return;
      }

      setCpfCnpjStatus("checking");
      const isAvailable = await checkCpfCnpjAvailability(cpfCnpjValue);
      setCpfCnpjStatus(isAvailable ? "available" : "unavailable");
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [cpfCnpjValue]);

  // Notificar componente pai sobre validação
  useEffect(() => {
    const isValid = crmStatus !== "unavailable" && cpfCnpjStatus !== "unavailable";
    onValidationChange?.(isValid);
  }, [crmStatus, cpfCnpjStatus, onValidationChange]);

  const handleEspecialidadeChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true);
      setValue("especialidade", "");
    } else {
      setShowCustomInput(false);
      const option = ESPECIALIDADES_COMUNS.find((opt) => opt.value === value);
      setValue("especialidade", option?.label || value);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    // Passa o arquivo para o componente pai
    onAvatarChange?.(file);
    // Marca como pendente no formulário
    setValue("avatar_url", file ? "pending" : undefined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
      {/* Coluna Esquerda - Avatar */}
      <div className="flex justify-center lg:justify-start">
        <AvatarUpload
          id="user-avatar"
          name="user-avatar"
          label="Foto de Perfil"
          type="user"
          onChange={handleAvatarChange}
          error={errors.avatar_url?.message}
        />
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="space-y-1.5">
        {!showCustomInput ? (
          <div>
            <SelectMenu
              id="especialidade"
              name="especialidade"
              label="Especialidade *"
              options={ESPECIALIDADES_COMUNS}
              value={ESPECIALIDADES_COMUNS.find((opt) => opt.label === especialidadeValue)?.value}
              onChange={handleEspecialidadeChange}
              placeholder="Selecione sua especialidade"
              searchPlaceholder="Buscar especialidade..."
              emptyMessage="Nenhuma especialidade encontrada"
            />
            <div className="h-5 mt-0.5">
              {errors.especialidade && (
                <p className="text-xs text-critical-600 dark:text-critical-400">
                  {errors.especialidade.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="especialidade-custom"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Especialidade *
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  setValue("especialidade", "");
                }}
                className="text-sm text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 transition-colors cursor-pointer"
              >
                ← Voltar para lista
              </button>
            </div>
            <Input
              id="especialidade-custom"
              type="text"
              placeholder="Ex: Medicina Integrativa"
              autoComplete="organization-title"
              error={errors.especialidade?.message}
              {...register("especialidade")}
            />
          </div>
        )}

        <Input
          label="CRM"
          type="text"
          placeholder="12345-UF"
          leftIcon={User}
          autoComplete="off"
          error={
            errors.crm?.message ||
            (crmStatus === "unavailable" ? "Este CRM já está cadastrado" : undefined)
          }
          {...register("crm", {
            onChange: (e) => {
              e.target.value = maskCrm(e.target.value);
            },
          })}
          rightElement={
            crmValue && crmValue.length >= 5 ? (
              <>
                {crmStatus === "checking" && (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {crmStatus === "available" && (
                  <CheckCircle2 className="w-5 h-5 text-health-600 dark:text-health-400" />
                )}
                {crmStatus === "unavailable" && (
                  <XCircle className="w-5 h-5 text-critical-600 dark:text-critical-400" />
                )}
              </>
            ) : undefined
          }
        />

        <Input
          label="CPF/CNPJ *"
          type="text"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          leftIcon={FileText}
          autoComplete="off"
          maxLength={18}
          error={
            errors.cpf_cnpj?.message ||
            (cpfCnpjStatus === "unavailable" ? "Este CPF/CNPJ já está cadastrado" : undefined)
          }
          {...register("cpf_cnpj", {
            onChange: (e) => {
              e.target.value = maskCpfCnpj(e.target.value);
            },
          })}
          rightElement={
            cpfCnpjValue && cpfCnpjValue.replace(/\D/g, "").length >= 11 ? (
              <>
                {cpfCnpjStatus === "checking" && (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {cpfCnpjStatus === "available" && (
                  <CheckCircle2 className="w-5 h-5 text-health-600 dark:text-health-400" />
                )}
                {cpfCnpjStatus === "unavailable" && (
                  <XCircle className="w-5 h-5 text-critical-600 dark:text-critical-400" />
                )}
              </>
            ) : undefined
          }
        />
      </div>
    </div>
  );
};
