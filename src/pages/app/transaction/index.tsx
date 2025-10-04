import { useMemo, useState } from "react";
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
import { useDB } from "@/hooks/use-db.hooks";
interface IFormData {
  type: "income" | "expense";
  category: string | undefined;
  amount: string;
  note: string;
  date: string;
}

const initData: IFormData = {
  type: "income",
  category: undefined,
  amount: "",
  note: "",
  date: new Date().toISOString(),
};

const Transaction = () => {
  const [formData, setFormData] = useState(initData);
  const { addExpense, listExpenses, downloadDB } = useDB();

  const category = useMemo(() => {
    if (formData.type === "income") {
      return INCOME_CATEGORIES;
    } else {
      return EXPENSE_CATEGORIES;
    }
  }, [formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(formData);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold">Transaction</p>
      <div className="w-full flex gap-4">
        <Button onClick={listExpenses}>List Expenses</Button>
        <Button onClick={() => downloadDB()}>Download DB</Button>
        <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg">
          <p className="text-2xl font-bold">Add Transaction</p>
          {/* Form container */}
          <div className="flex flex-col gap-4">
            {/* field container */}
            <div>
              <RadioGroup
                defaultValue="income"
                className="flex gap-2"
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as IFormData["type"],
                    category: undefined,
                  })
                }
              >
                <div
                  className="flex justify-center items-center gap-2 rounded-lg border border-gray-300 w-[100px] h-[50px]"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: "income",
                      category: undefined,
                    })
                  }
                >
                  <RadioGroupItem id="income" value="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
                <div
                  className="flex justify-center items-center gap-2 rounded-lg border border-gray-300 w-[100px] h-[50px]"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: "expense",
                      category: undefined,
                    })
                  }
                >
                  <RadioGroupItem id="expense" value="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
              </RadioGroup>
            </div>
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
                    <SelectLabel>
                      {formData.type === "income" ? "Income" : "Expense"}
                    </SelectLabel>
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
                value={new Date(formData.date)}
                onChange={(date) => {
                  const dateStr = date ? date.toISOString().split("T")[0] : "";
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
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFormData(initData)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
