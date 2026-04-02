import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import type { TransactionType } from "@/types/transaction.types";
import type { IBudget } from "@/types/budget-allocation.types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/category";
import { BUDGET_TYPE_LABELS } from "@/constants/allocation.constants";
import { startOfMonth, endOfMonth } from "date-fns";

export interface FilterState {
  category: string;
  budgetId: string;
  from: string;
  to: string;
}

interface Props {
  type: TransactionType;
  filters: FilterState;
  budgets: IBudget[];
  onChange: (filters: FilterState) => void;
}

const FilterSection = ({ type, filters, budgets, onChange }: Props) => {
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleBudgetChange = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return;
    onChange({
      ...filters,
      budgetId,
      from: startOfMonth(new Date(filters.from ?? budget.startedAt)).toISOString(),
      to: endOfMonth(new Date(filters.to ?? budget.endedAt)).toISOString(),
    });
  };

  const handleFromChange = (date: Date | undefined) => {
    if (!date) return;
    onChange({ ...filters, from: date.toISOString() });
  };

  const handleToChange = (date: Date | undefined) => {
    if (!date) return;
    onChange({ ...filters, to: date.toISOString() });
  };

  const fromDate = filters.from ? new Date(filters.from) : undefined;
  const toDate = filters.to ? new Date(filters.to) : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Budget */}
      <Select value={filters.budgetId} onValueChange={handleBudgetChange}>
        <SelectTrigger className="w-[160px] h-8 text-xs">
          <SelectValue placeholder="Select budget" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Budget</SelectLabel>
            {budgets.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                <span className="text-xs">
                  {BUDGET_TYPE_LABELS[b.type] ?? b.type}
                  {b.status && (
                    <span className="ml-1 text-green-600 font-medium">(active)</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filters.category}
        onValueChange={(v) => onChange({ ...filters, category: v === "__all__" ? "" : v })}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <SelectItem value="__all__">
              <span className="text-xs">All</span>
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <span className="text-xs">{cat.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* From */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 shrink-0">From</span>
        <DatePicker
          value={fromDate}
          onChange={handleFromChange}
          className="h-8 text-xs w-[150px]"
        />
      </div>

      {/* To */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 shrink-0">To</span>
        <DatePicker
          value={toDate}
          onChange={handleToChange}
          className="h-8 text-xs w-[150px]"
        />
      </div>
    </div>
  );
};

export default FilterSection;
