export type ReportType = "year" | "month";
export const DATE_PICKER_MODE = {
  RANGE_START: "range-start",
  RANGE_END: "range-end",
  SINGLE: "single",
} as const;

export interface IMainChartData {
  time: string;
  totalIncome: number;
  totalExpense: number;
}

// Income data
export interface IIncomeChartData {
  time: string;
  total: number;
  details: IChartDataDetail[];
}
export interface IChartDataDetail {
  id: number;
  name: string;
  amount: number;
  category: string;
}

// Expense data
export interface IExpenseChartData {
  time: string;
  total: number;
  details: IChartDataDetail[];
}
