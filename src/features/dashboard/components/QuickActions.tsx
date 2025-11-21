/**
 * QuickActions - Card de ações rápidas no dashboard
 */

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();
  const { workspace_slug } = useParams<{ workspace_slug: string }>();

  const handleStartConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${workspace_slug}/nova-consulta`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group cursor-pointer"
      onClick={handleStartConsultation}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-medical-100 dark:bg-medical-900/20 rounded-lg group-hover:bg-medical-200 dark:group-hover:bg-medical-900/30 transition-colors">
            <Sparkles className="h-5 w-5 text-medical-600 dark:text-medical-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Nova Consulta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Iniciar atendimento com IA</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-gray-100 border border-white/20 hover:border-white/30 transition-all"
          onClick={handleStartConsultation}
        >
          <Plus className="h-4 w-4 mr-1" />
          Iniciar
        </Button>
      </div>
    </div>
  );
}
