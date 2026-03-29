import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateWallet } from "@/hooks/wallet/UseCreateWallet";
import { getCurrentUser } from "@/services/auth.service";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";

const initData = { walletName: "", amount: "" };

const WalletForm = () => {
  const [formData, setFormData] = useState(initData);
  const { mutateAsync: createWallet } = useCreateWallet();
  const user = getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User not found");
      return;
    }
    try {
      const result = await createWallet({
        userId: user.id,
        walletName: formData.walletName,
        amount: Number(formData.amount),
      });
      if (result.success) {
        toast.success("Wallet created");
        setFormData(initData);
      } else {
        toast.error("Failed to create wallet");
      }
    } catch {
      // handled by mutation
    }
  };

  return (
    <>
      <p className="text-2xl font-bold">Add Wallet</p>
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
          <p className="text-xl font-bold">Initial Amount</p>
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
          <Button variant="outline" onClick={() => setFormData(initData)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
};

export default WalletForm;
