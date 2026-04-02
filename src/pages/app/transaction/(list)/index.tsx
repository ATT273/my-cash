import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteTransaction } from "@/hooks/transaction/UseDeleteTransaction";
import { useSearchTransactions } from "@/hooks/transaction/UseSearchTransactions";
import type { TransactionType } from "@/types/transaction.types";
import type { IBudget } from "@/types/budget-allocation.types";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Pen } from "lucide-react";
import EditTransactionForm from "../components/edit-transaction-form";
import CustomAlertDialog from "@/components/custom-components/AlertDialog";
import FilterSection, { type FilterState } from "../components/FilterSection";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

interface Props {
  type: TransactionType;
  budgets: IBudget[];
  activeBudgetId?: string;
}

const TransactionList = ({ type, budgets, activeBudgetId }: Props) => {
  const now = new Date();
  const activeBudget = budgets.find((b) => b.id === activeBudgetId);

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    budgetId: activeBudgetId ?? "",
    from: activeBudget ? startOfMonth(new Date(activeBudget.startedAt)).toISOString() : startOfMonth(now).toISOString(),
    to: activeBudget?.endedAt ?? endOfMonth(now).toISOString(),
  });

  // Sync when parent resolves the active budget
  useEffect(() => {
    if (!activeBudgetId) return;
    const budget = budgets.find((b) => b.id === activeBudgetId);
    setFilters((prev) => ({
      ...prev,
      budgetId: activeBudgetId,
      from: budget ? startOfMonth(new Date(budget.startedAt)).toISOString() : startOfMonth(now).toISOString(),
      to: budget?.endedAt ?? endOfMonth(now).toISOString(),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBudgetId]);

  const { data: transactions = [], isLoading } = useSearchTransactions({
    type,
    budgetId: filters.budgetId || undefined,
    category: filters.category || undefined,
    from: filters.from,
    to: filters.to,
  });

  const { mutateAsync: deleteTransaction } = useDeleteTransaction();

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className={`text-xl font-bold ${type === "expense" ? "text-red-500" : "text-green-500"}`}>
          {type === "expense" ? "Expense" : "Income"}
        </p>
        <FilterSection
          type={type}
          filters={filters}
          budgets={budgets}
          onChange={setFilters}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-400">No transactions found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="w-[100px]">{t.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>{t.note}</TableCell>
                <TableCell className="w-[80px]">
                  <div className="flex gap-1">
                    <EditTransactionForm type={type} item={t}>
                      <Button variant="ghost" size="icon">
                        <Pen className="text-green-500" size={16} />
                      </Button>
                    </EditTransactionForm>
                    <CustomAlertDialog
                      title="Delete Transaction"
                      description="Are you sure you want to delete this transaction?"
                      onConfirm={async () => {
                        try {
                          const result = await deleteTransaction(t.id);
                          if (result.success) {
                            toast.success("Transaction deleted");
                          } else {
                            toast.error("Failed to delete transaction");
                          }
                        } catch {
                          toast.error("Failed to delete transaction");
                        }
                      }}
                    >
                      <Button variant="ghost" size="icon">
                        <Trash2 className="text-red-500" size={16} />
                      </Button>
                    </CustomAlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TransactionList;
