/**
 * ReviewDataStep Component
 * Step 4: Revisão dos Dados
 */

import { User, Building2, MapPin, Edit2 } from "lucide-react";
import type { UseFormWatch } from "react-hook-form";
import type { OnboardingInput } from "@/schemas/onboarding.schema";

interface ReviewDataStepProps {
  watch: UseFormWatch<OnboardingInput>;
  onEditStep: (step: number) => void;
}

export const ReviewDataStep = ({ watch, onEditStep }: ReviewDataStepProps) => {
  const formData = watch();

  return (
    <div className="space-y-4">
      {/* Dados Profissionais */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados Profissionais
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="flex items-center gap-1 text-sm text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Especialidade</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.especialidade || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">CRM</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">{formData.crm || "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">CPF/CNPJ</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.cpf_cnpj || "-"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Dados da Clínica */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados da Clínica
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="flex items-center gap-1 text-sm text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Nome</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">{formData.nome || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Slug (URL)</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">{formData.slug || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Telefone Principal
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.telefone_principal || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Telefone Residencial
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.telefone_residencial || "-"}
            </dd>
          </div>
          {formData.descricao && (
            <div className="md:col-span-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Descrição</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5">{formData.descricao}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Endereço */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Endereço</h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="flex items-center gap-1 text-sm text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">CEP</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_cep || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Estado</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_estado || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Cidade</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_cidade || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Bairro</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_bairro || "-"}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Rua</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_rua || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Número</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
              {formData.endereco_numero || "-"}
            </dd>
          </div>
          {formData.endereco_complemento && (
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Complemento</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                {formData.endereco_complemento}
              </dd>
            </div>
          )}
          {formData.endereco_referencia && (
            <div className="md:col-span-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Referência</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                {formData.endereco_referencia}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
