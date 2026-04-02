import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_ALLOCATION_METHODS } from "@/constants/allocation.constants";
import { useState } from "react";
import MethodSettings from "./components/MethodSettings";
import BudgetOverview from "./components/BudgetOverview";
import WalletButton from "../wallet/components/WalletButton";
import { useCurrentWallet } from "@/hooks/wallet/UseCurrentWallet";
import { useGetUserWallets } from "@/hooks/wallet/UseGetUserWallets";
import { useGetBudgetByWallet } from "@/hooks/budget/UseGetBudgetByWallet";
import { useCreateBudget } from "@/hooks/budget/UseCreateBudget";
import { useArchiveBudget } from "@/hooks/budget/UseArchiveBudget";
import { getCurrentUser } from "@/services/auth.service";
import type { CreateBudgetJarInput } from "@/types/budget-allocation.types";
import { toast } from "sonner";

const BudgetAllocationPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const { currentWalletId } = useCurrentWallet();
  const { data: wallets = [] } = useGetUserWallets();
  const currentWallet = wallets.find((w) => w.id === currentWalletId) ?? null;
  const { data: activeBudget, isLoading: budgetLoading } = useGetBudgetByWallet(currentWalletId);
  const { mutateAsync: createBudget, isPending: isCreating } = useCreateBudget();
  const { mutateAsync: archiveBudget, isPending: isSwitching } = useArchiveBudget();
  const user = getCurrentUser();

  const handleCreateBudget = async (jars: CreateBudgetJarInput[]) => {
    if (!currentWalletId || !user) {
      toast.error("No wallet selected");
      return;
    }
    try {
      const result = await createBudget({
        walletId: currentWalletId,
        userId: user.id,
        type: selectedMethod as "six_jar" | "three_jar" | "zero_based",
        jars,
      });
      if (result.success) {
        toast.success("Budget created successfully");
        setSelectedMethod("");
      } else {
        toast.error("Failed to create budget");
      }
    } catch {
      toast.error("Failed to create budget");
    }
  };

  const handleSwitchBudget = async () => {
    if (!activeBudget) return;
    try {
      await archiveBudget(activeBudget.id);
      toast.success("Budget archived. Set up your new budget.");
      setSelectedMethod("");
    } catch {
      toast.error("Failed to switch budget");
    }
  };

  const walletBalance = currentWallet?.amount ?? 0;
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Budget Allocation</p>
        <WalletButton />
      </div>

      {!currentWalletId ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          Please select a wallet to manage budget allocation.
        </div>
      ) : (
        <div className="w-full h-full flex gap-4">
          {/* Left panel - Jar settings */}
          <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg overflow-y-auto">
            <p className="text-xl font-semibold">Jar settings</p>

            {budgetLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : activeBudget ? (
              <BudgetOverview
                budget={activeBudget}
                onSwitchBudget={handleSwitchBudget}
                isSwitching={isSwitching}
              />
            ) : (
              <>
                <p>Choose method</p>
                <Select
                  value={selectedMethod}
                  onValueChange={(value) => setSelectedMethod(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Methods</SelectLabel>
                      {DEFAULT_ALLOCATION_METHODS.map((method) => (
                        <SelectItem key={method.key} value={method.key}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {selectedMethod && (
                  <MethodSettings
                    method={selectedMethod}
                    walletBalance={walletBalance}
                    onSubmit={handleCreateBudget}
                    isLoading={isCreating}
                  />
                )}
              </>
            )}
          </div>

          {/* Right panel - Transactions */}
          <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">List of Transactions</p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex-1">
                <p className="text-xl font-bold text-green-500">Income</p>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-red-500">Expense</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAllocationPage;
