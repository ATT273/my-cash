import { useQuery } from "@tanstack/react-query";
import type { IMainChartData } from "@/types/report.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const fetchMonthlySummary = async (start: string, end: string): Promise<IMainChartData[]> => {
  const res = await fetch(
    `${TRANSACTION_ROUTES.SUMMARY_MONTHLY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );
  if (!res.ok) throw new Error("Failed to fetch monthly summary");
  return res.json();
};

export const useGetMonthlySummary = (start: string, end: string) => {
  return useQuery({
    queryKey: ["transactions", "summary", "monthly", start, end],
    queryFn: () => fetchMonthlySummary(start, end),
    enabled: !!start && !!end,
  });
};
