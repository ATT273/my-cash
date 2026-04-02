import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THREE_JAR_METHOD } from "@/constants/allocation.constants";
import { useState } from "react";
import type { CreateBudgetJarInput } from "@/types/budget-allocation.types";
import { formatCurrency } from "@/utils";

const initialValue = {
  wants: 30,
  savings: 20,
  needs: 50,
};

interface ThreeJarMethodProps {
  walletBalance: number;
  onSubmit: (jars: CreateBudgetJarInput[]) => void;
  isLoading?: boolean;
}

const ThreeJarMethod = ({ walletBalance, onSubmit, isLoading }: ThreeJarMethodProps) => {
  const jarArray = Object.entries(THREE_JAR_METHOD);
  const [error, setError] = useState("");
  const [jarPercentage, setJarPercentage] = useState(initialValue);
  const [selectedJar, setSelectedJar] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setSelectedJar("");
  };

  const onSave = () => {
    const totalPercentage = Object.values(jarPercentage).reduce((acc, val) => acc + val, 0);
    if (totalPercentage !== 100) {
      setError("Total percentage must equal 100%");
      return;
    }
    setError("");
    const jars: CreateBudgetJarInput[] = jarArray.map(([key, value]) => ({
      name: value.label,
      icon: value.iconKey,
      color: value.color,
      percentage: jarPercentage[key as keyof typeof jarPercentage],
      amount: Math.round((walletBalance * jarPercentage[key as keyof typeof jarPercentage]) / 100),
    }));
    onSubmit(jars);
  };

  const total = Object.values(jarPercentage).reduce((acc, val) => acc + val, 0);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Balance: <span className="font-semibold text-gray-700">{formatCurrency(walletBalance)}</span>
        {" · "}Total: <span className={total === 100 ? "font-semibold text-green-600" : "font-semibold text-red-500"}>{total}%</span>
      </p>
      {jarArray.map(([key, value]) => {
        const Icon = value.icon;
        const pct = jarPercentage[key as keyof typeof jarPercentage];
        const amount = Math.round((walletBalance * pct) / 100);
        return (
          <div key={key} className={`flex flex-col gap-1 p-2 rounded-lg ${value.color}`}>
            <div className="flex justify-between items-center gap-2 text-xl font-bold text-white">
              <Icon className="text-white" />
              <span className="text-sm font-normal opacity-80">{formatCurrency(amount)}</span>
            </div>
            {selectedJar === key ? (
              <div className="flex w-full justify-end gap-2">
                <p className="capitalize text-white text-3xl font-bold">{key}</p>
                <Input
                  value={pct ?? "0"}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    let newPct = e.target.value ? parseFloat(e.target.value) : 0;
                    if (newPct < 0 || newPct > 100) newPct = 0;
                    setJarPercentage({ ...jarPercentage, [key]: newPct });
                  }}
                  autoFocus
                  className="w-[70px] !text-white !font-bold !text-3xl"
                  onKeyDown={handleKeyDown}
                />
              </div>
            ) : (
              <p
                className="text-white text-3xl font-bold text-right cursor-pointer"
                onClick={() => setSelectedJar(key)}
              >
                <span className="capitalize">{key}</span>{" "}
                <span>{pct}%</span>
              </p>
            )}
          </div>
        );
      })}
      <div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Budget"}
        </Button>
      </div>
    </div>
  );
};

export default ThreeJarMethod;
