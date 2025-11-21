import type { DashboardStats } from "../types/dashboard.types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartProps {
  data?: DashboardStats["chart_data"];
}

export function DashboardChart({ data }: DashboardChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  const chartData = data.map((item: { date: string; count: number }) => {
    const date = new Date(item.date);
    return {
      total: item.count,
      dayName: date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3).toUpperCase(),
      dayNumber: date.getDate(),
      fullDate: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      }),
    };
  });

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm h-full flex flex-col">
      <div className="mb-4 shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Consultas da Semana
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Volume diário de atendimentos nos últimos 7 dias
        </p>
      </div>

      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              className="dark:stroke-gray-800"
            />
            <XAxis
              dataKey="dayName"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl">
                      <p className="font-semibold mb-1">{data.fullDate}</p>
                      <p className="text-primary-foreground">
                        <span className="font-bold text-lg">{data.total}</span> consultas
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#0ea5e9"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#0ea5e9" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
