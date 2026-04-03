import { useState } from "react";
import ZeroBasedMethodForm from "./ZeroBasedMethodForm";
import type { JarFormData, CreateBudgetJarInput } from "@/types/budget-allocation.types";
import { ICON_LIST } from "@/constants/icon.constants";
import { CircleQuestionMark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils";

interface ZeroBasedMethodProps {
  walletBalance: number;
  onSubmit: (jars: CreateBudgetJarInput[]) => void;
  isLoading?: boolean;
}

interface JarWithAmount extends JarFormData {
  amount: number;
}

const ZeroBasedMethod = ({ walletBalance, onSubmit, isLoading }: ZeroBasedMethodProps) => {
  const [jarArray, setJarArray] = useState<JarWithAmount[]>([]);
  const [error, setError] = useState("");

  const handleFormSubmit = (newJar: JarFormData) => {
    setJarArray((prev) => [...prev, { ...newJar, amount: 0 }]);
  };

  const handleAmountChange = (index: number, value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    const amount = numeric === "" ? 0 : parseInt(numeric, 10);
    setJarArray((prev) => prev.map((jar, i) => (i === index ? { ...jar, amount } : jar)));
  };

  const handleRemove = (index: number) => {
    setJarArray((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAllocated = jarArray.reduce((acc, jar) => acc + jar.amount, 0);

  const onSave = () => {
    if (jarArray.length === 0) {
      setError("Add at least one jar");
      return;
    }
    if (walletBalance > 0 && totalAllocated === 0) {
      setError("Please enter allocation amounts for your jars");
      return;
    }
    if (totalAllocated > walletBalance) {
      setError("Total allocated amount exceeds wallet balance");
      return;
    }
    setError("");
    const jars: CreateBudgetJarInput[] = jarArray.map((jar) => ({
      name: jar.name,
      icon: jar.icon,
      color: jar.color,
      percentage: null,
      amount: jar.amount,
    }));
    onSubmit(jars);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-500 flex justify-between">
        <span>Balance: <span className="font-semibold text-gray-700">{formatCurrency(walletBalance)}</span></span>
        <span>Allocated: <span className={`font-semibold ${totalAllocated > walletBalance ? "text-red-500" : "text-green-600"}`}>{formatCurrency(totalAllocated)}</span></span>
      </div>
      <ZeroBasedMethodForm onSubmit={handleFormSubmit} />
      <div className="flex flex-col gap-3">
        {jarArray.length > 0 ? (
          jarArray.map((jar, index) => {
            const Icon = ICON_LIST.find((icon) => icon.key === jar.icon)?.icon;
            return (
              <div key={`${jar.name}-${index}`} className={`flex items-center gap-2 p-2 rounded-lg ${jar.color}`}>
                <div className="text-white">
                  {Icon ? <Icon /> : <CircleQuestionMark />}
                </div>
                <p className="text-white font-bold capitalize flex-1">{jar.name}</p>
                <Input
                  className="w-[120px] text-right !font-semibold bg-white/20 border-white/40 text-white placeholder:text-white/60"
                  value={jar.amount === 0 ? "" : formatCurrency(jar.amount)}
                  placeholder="0"
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })
        ) : (
          <div className="text-center text-zinc-400 p-4">No jar added yet</div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {jarArray.length > 0 && (
        <div className="w-full flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Budget"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ZeroBasedMethod;
