/**
 * PatientInfoPopover
 * Popover com informações do paciente ao passar o mouse
 */

import { User, Calendar, Droplet, Phone, Mail, Info } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import type { Patient } from "../types/consultation.types";

interface PatientInfoPopoverProps {
  patient: Patient | null;
}

export const PatientInfoPopover = ({ patient }: PatientInfoPopoverProps) => {
  if (!patient) return null;

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
    <Popover
      trigger={
        <button
          className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          title="Ver informações completas do paciente"
        >
          <User className="h-4 w-4 text-medical-600 dark:text-medical-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {patient.nome}
          </span>
          <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
        </button>
      }
      triggerMode="hover"
      hoverDelay={200}
      side="bottom"
      align="start"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl p-4 space-y-3 w-80">
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

        {/* Info Grid */}
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
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Telefone"
              value={patient.telefone}
            />
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
            <p className="text-sm text-gray-600 dark:text-gray-400">{patient.historico_medico}</p>
          </div>
        )}
      </div>
    </Popover>
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
