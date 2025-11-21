/**
 * PatientInfoPanel
 * Painel com informações do paciente selecionado
 */

import { User, Calendar, Droplet, Phone, Mail } from "lucide-react";
import type { Patient } from "../types/consultation.types";

interface PatientInfoPanelProps {
  patient: Patient | null;
  isLoading?: boolean;
}

export const PatientInfoPanel = ({ patient, isLoading }: PatientInfoPanelProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum paciente selecionado</p>
        </div>
      </div>
    );
  }

  // Calcular idade a partir da data de nascimento
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

  const age = calculateAge(patient.data_nascimento);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/20 shrink-0">
          <User className="h-5 w-5 text-medical-600 dark:text-medical-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {patient.nome}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{age} anos</p>
        </div>
      </div>

      {/* Info Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data de Nascimento"
          value={patient.data_nascimento.split("-").reverse().join("/")}
        />

        {patient.tipo_sanguineo && (
          <InfoRow
            icon={<Droplet className="h-4 w-4" />}
            label="Tipo sanguíneo"
            value={patient.tipo_sanguineo}
          />
        )}

        {patient.telefone && (
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={patient.telefone} />
        )}

        {patient.email && (
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={patient.email} />
        )}
      </div>

      {/* Medical History */}
      {patient.historico_medico && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            Histórico Médico
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {patient.historico_medico}
          </p>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2 min-w-0">
    <div className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);
