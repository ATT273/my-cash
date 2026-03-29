import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useUpdateWallet } from "@/hooks/wallet/UseUpdateWallet";
import type { IWallet } from "@/types/wallet.types";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";

interface EditWalletFormProps {
  wallet: IWallet;
  children: React.ReactNode;
}

const EditWalletForm = ({ wallet, children }: EditWalletFormProps) => {
  const [formData, setFormData] = useState({ walletName: "", amount: "" });
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateWallet } = useUpdateWallet();

  useEffect(() => {
    if (wallet.id) {
      setFormData({ walletName: wallet.walletName, amount: wallet.amount.toString() });
    }
  }, [wallet]);

  const handleSubmit = async () => {
    try {
      const result = await updateWallet({
        walletId: wallet.id,
        updates: { walletName: formData.walletName, amount: Number(formData.amount) },
      });
      if (result.success) {
        setOpen(false);
        toast.success("Wallet updated");
      } else {
        toast.error("Failed to update wallet");
      }
    } catch {
      toast.error("Failed to update wallet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">Wallet Name</p>
            <Input
              placeholder="Enter wallet name"
              value={formData.walletName}
              onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">Amount</p>
            <Input
              type="text"
              placeholder="Enter amount"
              value={formatCurrency(Number(formData.amount))}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: numericValue });
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWalletForm;
