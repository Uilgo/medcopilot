import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";

export function useDashboardStats() {
  const { workspace_slug } = useParams<{ workspace_slug: string }>();

  return useQuery({
    queryKey: ["dashboard-stats", workspace_slug],
    queryFn: () => {
      if (!workspace_slug) throw new Error("Workspace slug not found");
      return dashboardService.getStats(workspace_slug);
    },
    enabled: !!workspace_slug,
    staleTime: 1000 * 60 * 2, // 2 minutos (dashboard precisa ser mais atualizado)
  });
}
