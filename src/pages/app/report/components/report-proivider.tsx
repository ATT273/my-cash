import type { IMainChartData } from "@/types/report.types";
import type { ITransaction } from "@/types/transaction.types";
import { createContext, useContext } from "react";

interface ReportContextValue {
  startTime: string;
  endTime: string;
  mainChartData: IMainChartData[];
  incomeReport: ITransaction[];
  expenseReport: ITransaction[];
}
const ReportContext = createContext<ReportContextValue | undefined>(undefined);

export const ReportProvider: React.FC<{
  children: React.ReactNode;
  startTime: string;
  endTime: string;
  mainChartData: IMainChartData[];
  incomeReport: ITransaction[];
  expenseReport: ITransaction[];
}> = ({
  children,
  startTime,
  endTime,
  mainChartData,
  incomeReport,
  expenseReport,
}) => {
  return (
    <ReportContext.Provider
      value={{ startTime, endTime, mainChartData, incomeReport, expenseReport }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export function useReport(): ReportContextValue {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within ReportProvider");
  return ctx;
}
