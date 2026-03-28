import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useGetYearlySummary } from "@/hooks/transaction/UseGetYearlySummary";
import { useGetMonthlySummary } from "@/hooks/transaction/UseGetMonthlySummary";
import { useGetTransactions } from "@/hooks/transaction/UseGetTransactions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import YearPicker from "@/components/ui/year-picker";
import { DATE_PICKER_MODE, type ReportType } from "@/types/report.types";
import { cn } from "@/lib/utils";
import ChartBarReport from "./components/bar-chart-report";
import PieChartReport from "./components/pie-chart-report";
import { ReportProvider } from "./components/report-proivider";

const Transaction = () => {
  const [reportType, setReportType] = useState<ReportType>("year");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [searchedStart, setSearchedStart] = useState("");
  const [searchedEnd, setSearchedEnd] = useState("");
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    activeLabel: string;
    activeIndex: string;
  } | null>(null);

  const { data: yearlySummary = [] } = useGetYearlySummary(searchedStart, searchedEnd);
  const { data: monthlySummary = [] } = useGetMonthlySummary(searchedStart, searchedEnd);
  const { data: allTransactions = [] } = useGetTransactions();

  const mainChartData = reportType === "year" ? yearlySummary : monthlySummary;

  const incomeReport = useMemo(() => {
    if (!selectedItem?.activeLabel) return [];
    const from = `${selectedItem.activeLabel}-01-01`;
    const to = `${selectedItem.activeLabel}-12-31`;
    return allTransactions.filter((t) => t.type === "income" && t.date >= from && t.date <= to);
  }, [selectedItem, allTransactions]);

  const expenseReport = useMemo(() => {
    if (!selectedItem?.activeLabel) return [];
    const from = `${selectedItem.activeLabel}-01-01`;
    const to = `${selectedItem.activeLabel}-12-31`;
    return allTransactions.filter((t) => t.type === "expense" && t.date >= from && t.date <= to);
  }, [selectedItem, allTransactions]);

  useEffect(() => {
    if (!selectedItem?.activeLabel) setIsViewingDetails(false);
  }, [selectedItem]);

  return (
    <ReportProvider
      startTime={startTime}
      endTime={endTime}
      mainChartData={mainChartData}
      incomeReport={incomeReport}
      expenseReport={expenseReport}
    >
      <div className="flex flex-col h-full gap-4">
        <p className="text-2xl font-bold">Reports</p>
        <div className="flex flex-col w-full h-full gap-4">
          <div className="flex items-end gap-2 bg-white p-2 rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Show by</p>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
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
              mode={DATE_PICKER_MODE.RANGE_START}
              type={reportType}
              value={startTime}
              onValueChange={(value) => setStartTime(value)}
            />
            <YearPicker
              mode={DATE_PICKER_MODE.RANGE_END}
              type={reportType}
              value={endTime}
              minTime={startTime}
              onValueChange={(value) => setEndTime(value)}
            />
            <Button onClick={() => { setSearchedStart(startTime); setSearchedEnd(endTime); }}>
              <Search />
            </Button>
          </div>
          <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                Period of {startTime} - {endTime}
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-4 flex-1 w-full">
                <div className="flex h-full gap-2 ">
                  <div className={cn("h-full ", isViewingDetails ? "w-1/2" : "w-full")}>
                    <ChartBarReport
                      viewDetails={isViewingDetails}
                      onItemClick={(e, isViewing) => {
                        setSelectedItem({
                          activeLabel: e?.activeLabel ?? "",
                          activeIndex: (e?.activeIndex as string) ?? "",
                        });
                        setIsViewingDetails(isViewing);
                      }}
                    />
                  </div>
                  {isViewingDetails && (
                    <div className="flex flex-col gap-2 flex-1 p-4 border border-gray-300 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-lg font-semibold">Selected year: {selectedItem?.activeLabel}</p>
                        {isViewingDetails && (
                          <Button variant={"ghost"} className="text-red-500" onClick={() => setIsViewingDetails(false)}>
                            <X />
                          </Button>
                        )}
                      </div>
                      <div className="h-full">
                        <PieChartReport type="income" />
                      </div>
                      <div className="h-full">
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
    </ReportProvider>
  );
};

export default Transaction;
