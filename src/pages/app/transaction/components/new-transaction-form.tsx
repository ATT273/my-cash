import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/category";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { formatCurrency } from "@/utils";
import { useMemo, useState } from "react";
import { useCreateTransaction } from "@/hooks/transaction/UseCreateTransaction";
import type { IFormData, JarAllocationInput } from "@/types/transaction.types";
import { useCurrentWallet } from "@/hooks/wallet/UseCurrentWallet";
import { useGetBudgetByWallet } from "@/hooks/budget/UseGetBudgetByWallet";
import { ICON_LIST } from "@/constants/icon.constants";
import { CircleQuestionMark } from "lucide-react";
import { toast } from "sonner";
import ZeroBasedAllocationDialog from "./ZeroBasedAllocationDialog";

const initData: IFormData = {
  type: "income",
  category: "",
  amount: "",
  note: "",
  date: "",
  jarId: undefined,
};

const NewTransactionForm = () => {
  const [formData, setFormData] = useState(initData);
  const [showZeroBasedDialog, setShowZeroBasedDialog] = useState(false);
  const { mutateAsync: addTransaction, isPending } = useCreateTransaction();
  const { currentWalletId: walletId } = useCurrentWallet();
  const { data: activeBudget } = useGetBudgetByWallet(walletId);

  const category = useMemo(() => {
    return formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }, [formData.type]);

  const isExpense = formData.type === "expense";
  const hasActiveBudget = !!activeBudget && activeBudget.jars.length > 0;
  const isZeroBasedBudget = activeBudget?.type === "zero_based";

  const validateForm = (): boolean => {
    if (!walletId) {
      toast.error("No wallet found");
      return false;
    }
    if (!hasActiveBudget) {
      toast.error("No budget to allocate income");
      return false;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (isExpense && hasActiveBudget && !formData.jarId) {
      toast.error("Please select a jar for this expense");
      return false;
    }
    return true;
  };

  const submitTransaction = async (jarAllocations?: JarAllocationInput[]) => {
    const _data = {
      walletId: walletId!,
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      note: formData.note,
      date: formData.date,
      ...(formData.jarId ? { jarId: formData.jarId } : {}),
      ...(jarAllocations ? { jarAllocations } : {}),
    };
    try {
      const result = await addTransaction(_data);
      if (result.success) {
        toast.success("Transaction has been added");
        setFormData(initData);
        setShowZeroBasedDialog(false);
      } else {
        toast.error("There was an error occured while adding transaction");
      }
    } catch {
      // error handled by mutation
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isExpense && isZeroBasedBudget) {
      setShowZeroBasedDialog(true);
      return;
    }

    await submitTransaction();
  };

  return (
    <>
      <p className="text-2xl font-bold">Add Transaction</p>
      <div className="flex flex-col gap-4">
        {/* Type */}
        <div>
          <RadioGroup
            defaultValue="income"
            className="flex gap-2"
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as IFormData["type"], category: "", jarId: undefined })
            }
          >
            <div
              className="flex justify-center items-center gap-2 rounded-lg border border-gray-300 w-[100px] h-[50px]"
              onClick={() => setFormData({ ...formData, type: "income", category: "", jarId: undefined })}
            >
              <RadioGroupItem id="income" value="income" />
              <Label htmlFor="income">Income</Label>
            </div>
            <div
              className="flex justify-center items-center gap-2 rounded-lg border border-gray-300 w-[100px] h-[50px]"
              onClick={() => setFormData({ ...formData, type: "expense", category: "", jarId: undefined })}
            >
              <RadioGroupItem id="expense" value="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Category</p>
          <Select
            key={formData.type}
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as IFormData["category"] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{formData.type === "income" ? "Income" : "Expense"}</SelectLabel>
                {category.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Jar selector — only for expense when active budget exists */}
        {isExpense && hasActiveBudget && (
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">Jar <span className="text-red-500">*</span></p>
            <Select
              value={formData.jarId ?? ""}
              onValueChange={(value) => setFormData({ ...formData, jarId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select jar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Jars</SelectLabel>
                  {activeBudget.jars.map((jar) => {
                    const Icon = ICON_LIST.find((i) => i.key === jar.icon)?.icon;
                    return (
                      <SelectItem key={jar.id} value={jar.id}>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${jar.color}`}>
                            {Icon ? <Icon size={12} className="text-white" /> : <CircleQuestionMark size={12} className="text-white" />}
                          </span>
                          {jar.name}
                          {jar.allocation && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({formatCurrency(jar.allocation.amount)})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Amount</p>
          <Input
            type="text"
            placeholder="Enter amount"
            value={formatCurrency(Number(formData.amount))}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              setFormData({ ...formData, amount: numeric === "" ? "" : numeric });
            }}
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Date</p>
          <DatePicker
            value={formData.date ? new Date(formData.date) : undefined}
            onChange={(date) => {
              setFormData({ ...formData, date: date ? date.toISOString() : "" });
            }}
            className="rounded-md border shadow-sm"
          />
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Note</p>
          <Input
            type="text"
            placeholder="Enter note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setFormData(initData)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>Submit</Button>
        </div>
      </div>

      {showZeroBasedDialog && activeBudget && (
        <ZeroBasedAllocationDialog
          open={showZeroBasedDialog}
          incomeAmount={Number(formData.amount)}
          jars={activeBudget.jars}
          onConfirm={(allocations) => submitTransaction(allocations)}
          onCancel={() => setShowZeroBasedDialog(false)}
          isLoading={isPending}
        />
      )}
    </>
  );
};

export default NewTransactionForm;
