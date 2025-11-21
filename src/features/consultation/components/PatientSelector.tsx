/**
 * PatientSelector
 * Dropdown para selecionar paciente + botão para criar novo
 */

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/SelectMenu";
import type { Patient } from "../types/consultation.types";

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading?: boolean;
  onSelect: (patient: Patient | null) => void;
  onNewPatient: () => void;
}

export const PatientSelector = ({
  patients,
  selectedPatient,
  isLoading,
  onSelect,
  onNewPatient,
}: PatientSelectorProps) => {
  // Garantir que patients é sempre um array
  const safePatients = Array.isArray(patients) ? patients : [];

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

  const patientOptions = safePatients.map((patient) => ({
    value: patient.id,
    label: `${patient.nome} - ${calculateAge(patient.data_nascimento)} anos`,
  }));

  const handleSelectChange = (value: string) => {
    const patient = safePatients.find((p) => p.id === value);
    onSelect(patient || null);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Dropdown de Pacientes */}
      <div className="w-full max-w-md min-w-[320px] -mb-7 [&_button]:h-11">
        <SelectMenu
          options={patientOptions}
          value={selectedPatient?.id || ""}
          onChange={handleSelectChange}
          placeholder="Selecionar Paciente"
          searchPlaceholder="Pesquisar paciente..."
          emptyMessage="Nenhum paciente encontrado"
          disabled={isLoading}
        />
      </div>

      {/* Botão Novo Paciente */}
      <Button onClick={onNewPatient} className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <UserPlus className="h-4 w-4" />
        Novo Paciente
      </Button>
    </div>
  );
};
