import { Button } from "@/components/ui/button";
import type { TransactionType } from "@/types/transaction.types";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type MouseHandlerDataParam,
} from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

interface Props {
  type: TransactionType;
}
const PieChartReport = ({ type }: Props) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill={type === "income" ? "#8884d8" : "#82ca9d"}
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default PieChartReport;
