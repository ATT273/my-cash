import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEARS } from "@/constants/calendar.constants";
import { useEffect, useMemo, useState } from "react";
import type { ReportType } from "@/types/report.types";

interface Props {
  value: string;
  mode?: ReportType;
  disableYears?: string[];
  minTime?: string;
  maxTime?: string;
  onValueChange: (value: string) => void;
}

const YearPicker = ({
  value,
  mode = "year",
  disableYears,
  minTime,
  maxTime,
  onValueChange,
}: Props) => {
  const convertedValue = useMemo(() => {
    const [year, month, date] = value.split("-");
    const validYear = !isNaN(parseInt(year));
    const validMonth = !isNaN(parseInt(month));
    const validDate = !isNaN(parseInt(date));

    return {
      year: validYear ? year : undefined,
      month: validMonth ? month : undefined,
      date: validDate ? date : undefined,
    };
  }, [value]);
  const minValue = useMemo(() => {
    const [year, month, date] = minTime?.split("-") ?? [];
    return { year, month, date };
  }, [minTime]);
  const maxValue = useMemo(() => {
    const [year, month, date] = maxTime?.split("-") ?? [];
    return { year, month, date };
  }, [maxTime]);

  const disabledMonths = useMemo(() => {
    if (!minTime && !maxTime) return [];
    return checkDisabledMonths({
      minValue,
      maxValue,
    });
  }, [minTime, maxTime, convertedValue.year, convertedValue.month]);

  function checkDisabledMonths({
    minValue,
    maxValue,
  }: {
    minValue: { year: string; month: string; date: string };
    maxValue: { year: string; month: string; date: string };
  }) {
    if (minValue.year === convertedValue.year) {
      const disabledMonths = [...MONTHS].filter(
        (month) => month.value < parseInt(minValue.month)
      );
      return disabledMonths.map((month) => month.value.toString());
    }
    if (maxValue.year === convertedValue.year) {
      const disabledMonths = [...MONTHS].filter(
        (month) => month.value > parseInt(maxValue.month)
      );
      return disabledMonths.map((month) => month.value.toString());
    }
    return [];
  }

  function handleValueChange(value: string, type: "year" | "month") {
    if (mode === "year") {
      onValueChange(`${value}-01-01`);
    } else {
      if (type === "year") {
        onValueChange(`${value}-undefined-01`);
      } else {
        onValueChange(`${convertedValue.year}-${value}-01`);
      }
    }
  }

  return (
    <div className="flex gap-2">
      <Select
        value={convertedValue.year ?? undefined}
        onValueChange={(value) => handleValueChange(value, "year")}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              disabled={
                disableYears?.includes(year.toString()) ||
                year < parseInt(minValue.year) ||
                year > parseInt(maxValue.year)
              }
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {mode === "month" && (
        <Select
          value={convertedValue.month ?? ""}
          onValueChange={(value) => handleValueChange(value, "month")}
        >
          <SelectTrigger className="w-[150px]" disabled={!convertedValue.year}>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem
                key={month.value}
                value={month.value.toString()}
                disabled={
                  disableYears?.includes(month.value.toString()) ||
                  disabledMonths.includes(month.value.toString())
                }
              >
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default YearPicker;
