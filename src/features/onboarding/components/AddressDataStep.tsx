/**
 * AddressDataStep Component
 * Step 3: Dados de Endereço
 */

import { useState } from "react";
import { MapPin, Home, Hash } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { maskCep, maskUf, maskNumber } from "@/utils/masks";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import type { OnboardingInput } from "@/schemas/onboarding.schema";

interface AddressDataStepProps {
  register: UseFormRegister<OnboardingInput>;
  errors: FieldErrors<OnboardingInput>;
  setValue: UseFormSetValue<OnboardingInput>;
}

export const AddressDataStep = ({ register, errors, setValue }: AddressDataStepProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");

    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setValue("endereco_estado", data.uf);
          setValue("endereco_cidade", data.localidade);
          setValue("endereco_bairro", data.bairro);
          setValue("endereco_rua", data.logradouro);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Linha 1: CEP + Estado + Cidade */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-3">
        <Input
          label="CEP *"
          type="text"
          placeholder="00000-000"
          leftIcon={MapPin}
          autoComplete="off"
          maxLength={9}
          error={errors.endereco_cep?.message}
          {...register("endereco_cep", {
            onChange: (e) => {
              e.target.value = maskCep(e.target.value);
            },
          })}
          onBlur={handleCepBlur}
          disabled={isLoadingCep}
        />
        <Input
          label="Estado *"
          type="text"
          placeholder="UF"
          autoComplete="off"
          maxLength={2}
          error={errors.endereco_estado?.message}
          {...register("endereco_estado", {
            onChange: (e) => {
              e.target.value = maskUf(e.target.value);
            },
          })}
        />
        <Input
          label="Cidade *"
          type="text"
          placeholder="Cidade"
          autoComplete="off"
          error={errors.endereco_cidade?.message}
          {...register("endereco_cidade")}
        />
      </div>

      {/* Linha 2: Bairro + Rua */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Bairro *"
          type="text"
          placeholder="Bairro"
          leftIcon={Home}
          autoComplete="off"
          error={errors.endereco_bairro?.message}
          {...register("endereco_bairro")}
        />
        <Input
          label="Rua *"
          type="text"
          placeholder="Rua/Avenida"
          leftIcon={Home}
          autoComplete="off"
          error={errors.endereco_rua?.message}
          {...register("endereco_rua")}
        />
      </div>

      {/* Linha 3: Número + Complemento */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
        <Input
          label="Número *"
          type="text"
          placeholder="123"
          leftIcon={Hash}
          autoComplete="off"
          error={errors.endereco_numero?.message}
          {...register("endereco_numero", {
            onChange: (e) => {
              e.target.value = maskNumber(e.target.value);
            },
          })}
        />
        <Input
          label="Complemento"
          type="text"
          placeholder="Apto, Sala..."
          autoComplete="off"
          error={errors.endereco_complemento?.message}
          {...register("endereco_complemento")}
        />
      </div>

      {/* Linha 4: Referência */}
      <Input
        label="Referência"
        type="text"
        placeholder="Ex: Próximo ao shopping, em frente à praça..."
        autoComplete="off"
        error={errors.endereco_referencia?.message}
        {...register("endereco_referencia")}
      />
    </div>
  );
};
