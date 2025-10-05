import { Button } from "@/components/ui/button";
import { Download, Search, X } from "lucide-react";
import { useTransactions } from "../components/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { formatCurrency } from "@/utils";
import YearPicker from "@/components/ui/year-picker";
import type { ReportType } from "@/types/report.types";

import { cn } from "@/lib/utils";
import ChartBarReport from "./components/bar-chart-report";
import PieChartReport from "./components/pie-chart-report";

const Transaction = () => {
  const { exportDB } = useTransactions();
  const [reportType, setReportType] = useState<ReportType>("year");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="flex flex-col h-full gap-4">
      <p className="text-2xl font-bold">Reports</p>
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex items-end gap-2 bg-white p-2 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Show by</p>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as ReportType)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select report level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="!h-9" />
          <YearPicker
            mode={reportType}
            value={startTime}
            onValueChange={(value) => setStartTime(value)}
          />
          <YearPicker
            mode={reportType}
            value={endTime}
            minTime={startTime}
            onValueChange={(value) => setEndTime(value)}
          />
          <Button>
            <Search />
          </Button>
        </div>
        <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              Period of {startTime} - {endTime}
            </p>
            <Button className="bg-green-500" onClick={() => exportDB()}>
              <Download />
            </Button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-4 flex-1 w-full">
              <div className="flex h-full gap-2 ">
                <div
                  className={cn(
                    "h-full ",
                    isViewingDetails ? "w-1/2" : "w-full"
                  )}
                >
                  <ChartBarReport
                    viewDetails={isViewingDetails}
                    onItemClick={(e, isViewing) => {
                      setSelectedItem(e);
                      setIsViewingDetails(isViewing);
                    }}
                  />
                </div>
                {isViewingDetails && (
                  <div className="flex flex-col gap-2 flex-1 p-4 border border-gray-300 rounded-lg">
                    <div className="text-right">
                      {isViewingDetails && (
                        <Button
                          variant={"ghost"}
                          className="text-red-500"
                          onClick={() => setIsViewingDetails(false)}
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                    <div className="h-full">
                      <p>Income</p>
                      <PieChartReport type="income" />
                    </div>
                    <div className="h-full">
                      <p>Expense</p>
                      <PieChartReport type="expense" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
