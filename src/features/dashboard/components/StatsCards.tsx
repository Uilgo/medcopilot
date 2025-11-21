import { Users, Calendar, Activity, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "../types/dashboard.types";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats?: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats || !stats.consultations || !stats.patients) {
    return null;
  }

  const cards = [
    {
      title: "Total de Consultas",
      value: stats.consultations.total,
      subtext: `${stats.consultations.today} hoje`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800",
      trend: "+12% vs mês anterior",
      trendUp: true,
    },
    {
      title: "Pacientes Ativos",
      value: stats.patients.total,
      subtext: `+${stats.patients.new_this_month} novos (30d)`,
      icon: Users,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      border: "border-violet-100 dark:border-violet-800",
      trend: "+5% vs mês anterior",
      trendUp: true,
    },
    {
      title: "Em Andamento",
      value: stats.consultations.in_progress,
      subtext: "Consultas agora",
      icon: Activity,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800",
      trend: "Tempo real",
      trendUp: true,
    },
    {
      title: "Finalizadas (30d)",
      value: stats.consultations.completed,
      subtext: "Alta produtividade",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800",
      trend: "+8% vs mês anterior",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-xl border bg-white dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group",
            card.border
          )}
        >
          {/* Topo: Ícone e Badge lado a lado */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110",
                card.bg,
                card.color
              )}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap",
                card.trendUp
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700"
              )}
            >
              {card.trend}
            </span>
          </div>

          {/* Conteúdo: Título em cima, Número e Subtexto lado a lado */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {card.title}
            </h3>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{card.subtext}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
