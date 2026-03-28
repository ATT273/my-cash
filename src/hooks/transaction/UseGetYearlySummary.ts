import { useQuery } from "@tanstack/react-query";
import type { IMainChartData } from "@/types/report.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const fetchYearlySummary = async (start: string, end: string): Promise<IMainChartData[]> => {
  const res = await fetch(
    `${TRANSACTION_ROUTES.SUMMARY_YEARLY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );
  if (!res.ok) throw new Error("Failed to fetch yearly summary");
  return res.json();
};

export const useGetYearlySummary = (start: string, end: string) => {
  return useQuery({
    queryKey: ["transactions", "summary", "yearly", start, end],
    queryFn: () => fetchYearlySummary(start, end),
    enabled: !!start && !!end,
  });
};
