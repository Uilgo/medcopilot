/**
 * Drawer de Detalhes da Consulta
 */

import { Drawer } from "@/components/ui/Drawer";
import { User, Calendar, Clock, FileText, Activity, Sparkles } from "lucide-react";
import type { ConsultationHistory } from "../types/history.types";

interface ConsultationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: ConsultationHistory | null;
}

export const ConsultationDetailsDrawer = ({
  isOpen,
  onClose,
  consultation,
}: ConsultationDetailsDrawerProps) => {
  if (!consultation) return null;

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Detalhes da Consulta" size="md">
      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          {consultation.mensagens_count !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>{consultation.mensagens_count} mensagens</span>
            </div>
          )}
        </div>

        {/* Paciente */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-medical-600 dark:text-medical-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Informações do Paciente</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Nome:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {consultation.paciente?.nome || "Não informado"}
              </p>
            </div>
            {consultation.paciente?.data_nascimento && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Idade:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {calculateAge(consultation.paciente.data_nascimento)} anos
                </p>
              </div>
            )}
            {consultation.paciente?.cpf && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">CPF:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {consultation.paciente.cpf}
                </p>
              </div>
            )}
            {consultation.paciente?.telefone && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {consultation.paciente.telefone}
                </p>
              </div>
            )}
            {consultation.paciente?.email && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">E-mail:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {consultation.paciente.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Queixa Principal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Queixa Principal</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {consultation.queixa_principal || "Não informada"}
          </p>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Iniciada em
              </span>
            </div>
            <p className="text-gray-900 dark:text-white">
              {new Date(consultation.iniciada_em).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(consultation.iniciada_em).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {consultation.finalizada_em && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Finalizada em
                </span>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(consultation.finalizada_em).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(consultation.finalizada_em).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Análise de IA */}
        {consultation.analise && (
          <div className="bg-medical-50 dark:bg-medical-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-medical-600 dark:text-medical-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Análise de IA</h3>
              <span className="ml-auto px-2 py-1 rounded-full text-xs font-medium bg-medical-600 text-white">
                {consultation.analise.confianca}% confiança
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Diagnóstico:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {consultation.analise.diagnostico_principal}
                </p>
              </div>
              {consultation.analise.cid10 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">CID-10:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {consultation.analise.cid10}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
