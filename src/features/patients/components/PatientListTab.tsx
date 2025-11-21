import type { Patient } from "../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MoreHorizontal, FileText, User, Phone, Calendar, RefreshCw } from "lucide-react";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/Dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { PatientsSkeleton } from "./PatientsSkeleton";

interface PatientListTabProps {
  patients?: Patient[];
  isLoading: boolean;
  onSearchChange?: (term: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PatientListTab({
  patients = [],
  isLoading,
  onSearchChange,
  onRefresh,
  isRefreshing = false,
}: PatientListTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearchChange?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header com busca, contador e refresh */}
      <div className="flex items-center justify-between shrink-0">
        <div className="w-full max-w-sm min-w-[300px]">
          <Input
            leftIcon={Search}
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Total: <strong>{patients.length}</strong> pacientes
          </div>

          <Button
            onClick={onRefresh}
            variant="outline"
            size="md"
            disabled={isRefreshing || isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabela com scroll interno */}
      <div className="flex-1 rounded-md border overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Tipo Sang.</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
        </Table>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <PatientsSkeleton />
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {patient.nome}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {patient.telefone || "-"}
                        </span>
                        <span className="text-muted-foreground">{patient.email || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{patient.cpf || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(patient.data_nascimento) || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.tipo_sanguineo ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          {patient.tipo_sanguineo}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dropdown
                        align="right"
                        trigger={
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownLabel>Ações</DropdownLabel>
                        <DropdownItem>
                          <FileText className="mr-2 h-4 w-4 inline-block" />
                          Ver Prontuário
                        </DropdownItem>
                        <DropdownItem>
                          <User className="mr-2 h-4 w-4 inline-block" />
                          Editar Dados
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem variant="danger">Inativar Paciente</DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
