import type { TransactionType } from "@/types/transaction.types";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useReport } from "./report-proivider";
import { formatCurrency } from "@/utils";

interface Props {
  type: TransactionType;
}
const PieChartReport = ({ type }: Props) => {
  const { incomeReport, expenseReport } = useReport();

  const renderCustomizedLabel = ({ value }: any) => {
    return `${formatCurrency(value)} đ`;
  };

  const totalIncome = incomeReport.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseReport.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  return (
    <>
      <p>
        <span className="font-semibold">
          {type === "income" ? "Income: " : "Expense: "}
        </span>
        {formatCurrency(type === "income" ? totalIncome : totalExpense)} đ
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={(type === "income" ? incomeReport : expenseReport) as any}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill={type === "income" ? "#8884d8" : "#82ca9d"}
            label={renderCustomizedLabel}
          />
          <Tooltip
            formatter={(value, name) => {
              return [formatCurrency(parseInt(value.toString())), name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default PieChartReport;
