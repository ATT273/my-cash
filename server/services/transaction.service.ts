import { prisma } from "../lib/prisma";

export interface IMainChartData {
  time: string;
  totalIncome: number;
  totalExpense: number;
}

export const getMonthlySummary = async (
  startDate: string,
  endDate: string
): Promise<IMainChartData[]> => {
  const result = await prisma.$queryRaw<IMainChartData[]>`
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS time,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)::float AS "totalIncome",
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)::float AS "totalExpense"
    FROM "Transaction"
    WHERE date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
    GROUP BY time
    ORDER BY time
  `;
  return result;
};

export const getYearlySummary = async (
  startDate: string,
  endDate: string
): Promise<IMainChartData[]> => {
  const result = await prisma.$queryRaw<IMainChartData[]>`
    SELECT
      TO_CHAR(date, 'YYYY') AS time,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)::float AS "totalIncome",
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)::float AS "totalExpense"
    FROM "Transaction"
    WHERE date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
    GROUP BY time
    ORDER BY time
  `;
  return result;
};
