import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentWallet } from "@/hooks/wallet/UseCurrentWallet";
import { useGetUserWallets } from "@/hooks/wallet/UseGetUserWallets";
import type { IWallet } from "@/types/wallet.types";
import { formatCurrency } from "@/utils";

const WalletButton = () => {
  const [open, setOpen] = useState(false);
  const { currentWalletId, selectWallet } = useCurrentWallet();
  const { data: wallets = [] } = useGetUserWallets();
  const currentWallet = wallets.find((w) => w.id === currentWalletId) ?? null;

  const handleSelect = (walletId: string) => {
    selectWallet(walletId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-9">
          <Wallet size={15} />
          {currentWallet ? (
            <>
              <span className="font-semibold">{currentWallet.walletName}</span>
              <span className="text-gray-400 text-sm">{formatCurrency(currentWallet.amount)}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No wallet selected</span>
          )}
          <ChevronDown size={13} className="text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {wallets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No wallets available. Create one in the Wallet page.
            </p>
          ) : (
            wallets.map((wallet: IWallet) => (
              <button
                key={wallet.id}
                className={`flex items-center justify-between w-full p-3 rounded-lg border text-left transition-colors ${
                  wallet.id === currentWalletId
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onClick={() => handleSelect(wallet.id)}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">{wallet.walletName}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(wallet.amount)}</span>
                </div>
                {wallet.id === currentWalletId && (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletButton;
