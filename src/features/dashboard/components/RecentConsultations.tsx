import type { DashboardStats } from "../types/dashboard.types";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

interface RecentConsultationsProps {
  consultations?: DashboardStats["recent_consultations"];
}

export function RecentConsultations({ consultations = [] }: RecentConsultationsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Consultas Recentes
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Últimos atendimentos realizados
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("../historico")}
          className="text-primary hover:text-primary/80 shrink-0"
        >
          Ver tudo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>Nenhuma consulta recente</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {consultations.slice(0, 4).map((consultation) => (
              <div
                key={consultation.id}
                className="flex-1 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3 group cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 last:rounded-b-2xl overflow-hidden"
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                  {consultation.paciente.nome.substring(0, 2).toUpperCase()}
                </div>

                {/* Info do paciente */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                    {consultation.paciente.nome}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {consultation.queixa_principal}
                  </p>
                </div>

                {/* Status e hora */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(consultation.iniciada_em).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
