/**
 * PacientesPage
 * Página de listagem de pacientes
 */

import { useEffect, useState } from "react";
import { usePageStore } from "@/store/usePageStore";
import { PatientListTab } from "@/features/patients/components/PatientListTab";
import { usePatients } from "@/features/patients/hooks/usePatients";

export const PacientesPage = () => {
  const { setPageInfo } = usePageStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Hook para buscar pacientes com React Query
  const { data, isLoading, refetch, isRefetching } = usePatients(1, 10, searchTerm);

  useEffect(() => {
    setPageInfo("Pacientes", "Gerencie sua base de pacientes");
  }, [setPageInfo]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="h-full flex flex-col p-6">
      <PatientListTab
        patients={data?.data || []}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />
    </div>
  );
};
