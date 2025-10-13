import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type MouseHandlerDataParam,
} from "recharts";
import { useReport } from "./report-proivider";
import { formatCurrency } from "@/utils";

interface Props {
  viewDetails: boolean;
  onItemClick: (e: MouseHandlerDataParam | null, isViewing: boolean) => void;
}

const ChartBarReport = ({ onItemClick }: Props) => {
  const { mainChartData } = useReport();
  // const handleBarChatClick = (e: MouseHandlerDataParam | null) => {
  //   console.log("bar click", e);
  //   onItemClick(e, true);
  // };
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={mainChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onClick={(e) => onItemClick(e, true)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            trigger="click"
            formatter={(value, name) => {
              return [formatCurrency(parseInt(value.toString())), name];
            }}
          />
          <Legend />
          <Bar
            dataKey="totalIncome"
            fill="#8884d8"
            name="Total income"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
            className="cursor-pointer"
          />
          <Bar
            dataKey="totalExpense"
            fill="#82ca9d"
            name="Total expense"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
            className="cursor-pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartBarReport;
