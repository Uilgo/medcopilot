/**
 * OnboardingForm Component
 * Formulário multi-step de onboarding
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VerticalStepper } from "@/components/ui/VerticalStepper";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
import { ProfessionalDataStep } from "./ProfessionalDataStep";
import { WorkspaceDataStep } from "./WorkspaceDataStep";
import { AddressDataStep } from "./AddressDataStep";
import { ReviewDataStep } from "./ReviewDataStep";
import { onboardingSchema, type OnboardingInput } from "@/schemas/onboarding.schema";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

const STEPS = [
  { label: "Profissional", description: "Seus dados" },
  { label: "Clínica", description: "Dados do consultório" },
  { label: "Endereço", description: "Localização" },
  { label: "Revisão", description: "Confirme os dados" },
];

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [step1Valid, setStep1Valid] = useState(true); // Validação do step 1
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isCompletingOnboarding, onboardingError } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "all", // Mostra todos os erros
  });

  const onSubmit = async (data: OnboardingInput) => {
    // IMPORTANTE: Só submeter se estiver no último step (step 4)
    if (currentStep !== STEPS.length) {
      return;
    }

    // Mostrar modal imediatamente
    setShowSuccessModal(true);

    try {
      // Detectar automaticamente se é CPF ou CNPJ baseado no tamanho
      const digits = data.cpf_cnpj.replace(/\D/g, "");
      const tipo_documento: "cpf" | "cnpj" = digits.length <= 11 ? "cpf" : "cnpj";

      // 1. Upload de avatar (se existir)
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const { uploadImage } = await import("@/utils/uploadImage");
        avatarUrl =
          (await uploadImage({
            type: "avatar",
            file: avatarFile,
          })) || undefined;
      }

      // 2. Preparar dados do onboarding (JSON puro)
      const onboardingData = {
        // Dados profissionais
        especialidade: data.especialidade,
        crm: data.crm,
        avatar_url: avatarUrl,

        // Dados do workspace
        nome_workspace: data.nome,
        slug: data.slug,
        descricao: data.descricao || undefined,
        logo_url: undefined, // Logo será feito depois do onboarding
        telefone_principal: data.telefone_principal,
        telefone_residencial: data.telefone_residencial || undefined,
        tipo_documento,
        cpf_cnpj: data.cpf_cnpj,
        endereco_cep: data.endereco_cep,
        endereco_estado: data.endereco_estado,
        endereco_cidade: data.endereco_cidade,
        endereco_bairro: data.endereco_bairro,
        endereco_rua: data.endereco_rua,
        endereco_numero: data.endereco_numero,
        endereco_complemento: data.endereco_complemento || undefined,
        endereco_referencia: data.endereco_referencia || undefined,
      };

      // 3. Enviar JSON para o backend e aguardar resposta
      const response = await authService.onboarding(onboardingData);

      // 4. Upload de logo após onboarding (quando já temos workspace_id)
      if (logoFile && response.data.workspace?.id) {
        try {
          const { uploadImage } = await import("@/utils/uploadImage");
          const logoUrl = await uploadImage({
            type: "logo",
            file: logoFile,
            workspaceId: response.data.workspace.id,
          });

          if (logoUrl) {
            // Logo enviado com sucesso
            // O backend já atualiza automaticamente o workspace com logo_url
          }
        } catch (logoError) {
          console.error("Erro ao enviar logo:", logoError);
          // Não bloquear o fluxo se o logo falhar
        }
      }

      // 5. Mostrar modal de sucesso
      setShowSuccessModal(true);

      // 6. Invalidar queries em background
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // 7. Aguardar 2 segundos e redirecionar
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await queryClient.refetchQueries({ queryKey: ["me"] });
      await queryClient.refetchQueries({ queryKey: ["workspaces"] });
      navigate(`/${response.data.workspace.slug}/dashboard`);
    } catch (error) {
      console.error("Erro ao processar onboarding:", error);

      // Fechar modal em caso de erro
      setShowSuccessModal(false);

      // Extrair mensagem de erro do backend
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao processar dados. Tente novamente.";

      toast.error(errorMessage);
    }
  };

  // Verificar se pode avançar para o próximo step
  const canProceed = () => {
    if (currentStep === 1) {
      // Step 1: Verificar validações de CRM/CPF e campos obrigatórios
      const especialidade = watch("especialidade");
      const cpfCnpj = watch("cpf_cnpj");

      return (
        step1Valid && // Validações RPC (CRM/CPF não duplicados)
        !!especialidade &&
        !!cpfCnpj &&
        cpfCnpj.replace(/\D/g, "").length >= 11 &&
        !errors.especialidade &&
        !errors.cpf_cnpj &&
        !errors.crm
      );
    }

    if (currentStep === 2) {
      // Step 2: Verificar campos obrigatórios e slug
      const nome = watch("nome");
      const slug = watch("slug");
      const telefone = watch("telefone_principal");

      // Verificar se telefone está completo (10 ou 11 dígitos)
      const telefoneDigits = telefone?.replace(/\D/g, "") || "";
      const telefoneCompleto = telefoneDigits.length === 10 || telefoneDigits.length === 11;

      const isValid =
        !!nome &&
        !!slug &&
        slug.length >= 2 &&
        !!telefone &&
        telefoneCompleto &&
        !errors.nome &&
        !errors.slug &&
        !errors.telefone_principal;

      return isValid;
    }

    if (currentStep === 3) {
      // Step 3: Verificar campos de endereço obrigatórios
      const cep = watch("endereco_cep");
      const estado = watch("endereco_estado");
      const cidade = watch("endereco_cidade");
      const bairro = watch("endereco_bairro");
      const rua = watch("endereco_rua");
      const numero = watch("endereco_numero");

      return (
        !!cep &&
        !!estado &&
        !!cidade &&
        !!bairro &&
        !!rua &&
        !!numero &&
        !errors.endereco_cep &&
        !errors.endereco_estado &&
        !errors.endereco_cidade &&
        !errors.endereco_bairro &&
        !errors.endereco_rua &&
        !errors.endereco_numero
      );
    }

    return true;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    // Prevenir submit do form
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let fieldsToValidate: (keyof OnboardingInput)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["especialidade", "crm", "cpf_cnpj"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "nome",
        "slug",
        "telefone_principal",
        "telefone_residencial",
        "descricao",
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "endereco_cep",
        "endereco_estado",
        "endereco_cidade",
        "endereco_bairro",
        "endereco_rua",
        "endereco_numero",
      ];
    }

    // Trigger com shouldFocus para focar no primeiro campo com erro
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Mostrar erro do onboarding
  useEffect(() => {
    if (onboardingError) {
      console.error("Erro completo do onboarding:", onboardingError);

      // Tentar extrair mensagem de erro da resposta
      const error = onboardingError as Error & {
        response?: { data?: { message?: string; error?: string } };
      };
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao completar onboarding";

      toast.error(errorMessage);
    }
  }, [onboardingError]);

  return (
    <>
      {/* Modal de Sucesso */}
      <OnboardingSuccessModal open={showSuccessModal} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-full min-h-0">
        {/* Left Column - Vertical Stepper */}
        <div className="hidden lg:block bg-gray-50 dark:bg-gray-900/50 p-8 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <VerticalStepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Right Column - Form */}
        <div className="flex flex-col h-full min-h-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              // Prevenir submit com Enter se não estiver no último step
              if (e.key === "Enter" && currentStep !== STEPS.length) {
                e.preventDefault();
              }
            }}
            className="flex flex-col h-full min-h-0"
          >
            {/* Header - Fixed (only for step 1) */}
            {currentStep === 1 && (
              <div className="shrink-0 p-8 lg:px-12 lg:pt-12 lg:pb-0">
                <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Bem-vindo ao MedCopilot! 👋
                  </h1>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Vamos configurar sua conta em apenas 4 passos simples
                  </p>
                </div>
              </div>
            )}

            {/* Step Header - Fixed (only for steps 2 and 3) */}
            {currentStep > 1 && (
              <div className="shrink-0 px-8 lg:px-12 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Dados da Clínica
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Informações do seu consultório ou clínica
                    </p>
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Endereço
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Onde sua clínica está localizada
                    </p>
                  </div>
                )}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Revisão dos Dados
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confira se todas as informações estão corretas
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-4 min-h-0">
              {currentStep === 1 && (
                <ProfessionalDataStep
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  onAvatarChange={setAvatarFile}
                  onValidationChange={setStep1Valid}
                />
              )}
              {currentStep === 2 && (
                <WorkspaceDataStep
                  register={register}
                  errors={errors}
                  watch={watch}
                  control={control}
                  onLogoChange={setLogoFile}
                />
              )}
              {currentStep === 3 && (
                <AddressDataStep register={register} errors={errors} setValue={setValue} />
              )}
              {currentStep === 4 && <ReviewDataStep watch={watch} onEditStep={setCurrentStep} />}
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            <div className="shrink-0 flex justify-between gap-4 px-8 lg:px-12 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isCompletingOnboarding}
                  leftIcon={ArrowLeft}
                  size="lg"
                >
                  Voltar
                </Button>
              )}

              <div className="ml-auto flex gap-4">
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    disabled={isCompletingOnboarding || !canProceed()}
                    rightIcon={ArrowRight}
                    size="lg"
                  >
                    Próximo passo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCompletingOnboarding}
                    leftIcon={isCompletingOnboarding ? Loader2 : Check}
                    size="lg"
                  >
                    {isCompletingOnboarding ? "Finalizando..." : "Concluir cadastro"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
