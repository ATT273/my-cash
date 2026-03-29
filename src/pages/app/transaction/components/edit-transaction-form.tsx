import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/category";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useUpdateTransaction } from "@/hooks/transaction/UseUpdateTransaction";
import type { IFormData, ITransaction, IUpdateTransactionInput, TransactionType } from "@/types/transaction.types";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";

const initData: IUpdateTransactionInput = {
  id: "",
  type: "income",
  category: "",
  amount: "",
  note: "",
  date: "",
};

interface EditTransactionFormProps {
  item: ITransaction;
  type: TransactionType;
  children: React.ReactNode;
}
const EditTransactionForm = ({ item, type, children }: EditTransactionFormProps) => {
  const [formData, setFormData] = useState<IUpdateTransactionInput>(initData);
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTransaction } = useUpdateTransaction();

  useEffect(() => {
    if (item.id) {
      setFormData({
        id: item.id,
        type: item.type,
        category: item.category,
        amount: item.amount.toString(),
        note: item.note || "",
        date: item.date,
      });
    }
  }, [item]);

  const category = useMemo(() => {
    if (type === "income") {
      return INCOME_CATEGORIES;
    } else {
      return EXPENSE_CATEGORIES;
    }
  }, [type]);

  const handleSubmit = async () => {
    const data = {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      note: formData.note,
      date: formData.date,
    };
    try {
      const result = await updateTransaction({ id: formData.id, data });
      if (result.success) {
        setOpen(false);
        toast.success("Transaction has been updated");
      } else {
        toast.error("Failed to update transaction");
      }
    } catch {
      toast.error("Failed to update transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Category</p>
          <Select
            key={formData.type}
            value={formData.category}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: value as IFormData["category"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{formData.type === "income" ? "Income" : "Expense"}</SelectLabel>
                {category.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Amount</p>
          <Input
            type="text"
            placeholder="Enter amount"
            value={formatCurrency(Number(formData.amount))}
            onChange={(e) => {
              const numbericValue = e.target.value.replace(/[^0-9]/g, "");
              if (numbericValue === "") {
                setFormData({ ...formData, amount: "" });
              } else {
                setFormData({ ...formData, amount: numbericValue });
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Date</p>
          <DatePicker
            value={formData.date ? new Date(formData.date) : undefined}
            onChange={(date) => {
              const dateStr = date ? date.toISOString() : "";
              setFormData({ ...formData, date: dateStr });
            }}
            className="rounded-md border shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Note</p>
          <Input
            type="text"
            placeholder="Enter note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionForm;
