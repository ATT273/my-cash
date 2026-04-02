import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Wallet } from "lucide-react";
import type { IWallet } from "@/types/wallet.types";
import { formatCurrency } from "@/utils";
import { BUDGET_TYPE_LABELS } from "@/constants/allocation.constants";

interface CurrentWalletProps {
  currentWallet: IWallet | null;
  wallets: IWallet[];
  onSelectWallet: (walletId: string) => void;
}

const CurrentWallet = ({ currentWallet, wallets, onSelectWallet }: CurrentWalletProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (walletId: string) => {
    onSelectWallet(walletId);
    setOpen(false);
  };

  const activeBudget = currentWallet?.budgets?.[0];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl font-bold">Current Wallet</p>

      {currentWallet ? (
        <div className="flex flex-col gap-2 p-3 rounded-lg border border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-green-600" />
            <span className="font-semibold text-green-800">{currentWallet.walletName}</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(currentWallet.amount)}</p>
          {activeBudget ? (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full self-start">
              {BUDGET_TYPE_LABELS[activeBudget.type] ?? activeBudget.type}
            </span>
          ) : (
            <span className="text-xs text-gray-400">No budget assigned</span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">No wallet selected. Please select a wallet to use for transactions.</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={currentWallet ? "outline" : "default"} className="w-full">
            {currentWallet ? "Change Wallet" : "Select Wallet"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Wallet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {wallets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No wallets available. Create one first.</p>
            ) : (
              wallets.map((wallet) => {
                const budget = wallet.budgets?.[0];
                return (
                  <button
                    key={wallet.id}
                    className={`flex items-center justify-between w-full p-3 rounded-lg border text-left transition-colors ${
                      wallet.id === currentWallet?.id
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(wallet.id)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{wallet.walletName}</span>
                      <span className="text-sm text-gray-500">{formatCurrency(wallet.amount)}</span>
                      {budget ? (
                        <span className="text-xs text-blue-500 font-medium">
                          {BUDGET_TYPE_LABELS[budget.type] ?? budget.type}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No budget</span>
                      )}
                    </div>
                    {wallet.id === currentWallet?.id && (
                      <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurrentWallet;
