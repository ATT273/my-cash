import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pen, CheckCircle2 } from "lucide-react";
import { useGetUserWallets } from "@/hooks/wallet/UseGetUserWallets";
import { useDeleteWallet } from "@/hooks/wallet/UseDeleteWallet";
import type { IWallet } from "@/types/wallet.types";
import { formatCurrency } from "@/utils";
import { BUDGET_TYPE_LABELS } from "@/constants/allocation.constants";
import EditWalletForm from "./EditWalletForm";
import CustomAlertDialog from "@/components/custom-components/AlertDialog";
import { toast } from "sonner";

interface WalletListProps {
  currentWalletId: string;
  onSelectWallet: (walletId: string) => void;
}

const WalletList = ({ currentWalletId, onSelectWallet }: WalletListProps) => {
  const { data: wallets = [] } = useGetUserWallets();
  const { mutateAsync: deleteWallet } = useDeleteWallet();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wallet Name</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-center">Selected</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {wallets.map((wallet: IWallet) => {
          const activeBudget = wallet.budgets?.[0];
          return (
            <TableRow key={wallet.id}>
              <TableCell className="font-medium">{wallet.walletName}</TableCell>
              <TableCell className="text-right">{formatCurrency(wallet.amount)}</TableCell>
              <TableCell>
                {activeBudget ? (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {BUDGET_TYPE_LABELS[activeBudget.type] ?? activeBudget.type}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">No budget</span>
                )}
              </TableCell>
              <TableCell>{new Date(wallet.createdAt).toDateString()}</TableCell>
              <TableCell className="text-center">
                {wallet.id === currentWalletId ? (
                  <CheckCircle2 className="inline text-green-500" size={20} />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-green-500"
                    onClick={() => onSelectWallet(wallet.id)}
                  >
                    Select
                  </Button>
                )}
              </TableCell>
              <TableCell className="w-[80px]">
                <div className="flex gap-2">
                  <EditWalletForm wallet={wallet}>
                    <Button variant="ghost">
                      <Pen className="text-green-500" />
                    </Button>
                  </EditWalletForm>
                  <CustomAlertDialog
                    title="Delete Wallet"
                    description="Are you sure you want to delete this wallet?"
                    onConfirm={async () => {
                      try {
                        const result = await deleteWallet(wallet.id);
                        if (result.success) {
                          toast.success("Wallet deleted");
                        } else {
                          toast.error("Failed to delete wallet");
                        }
                      } catch {
                        toast.error("Failed to delete wallet");
                      }
                    }}
                  >
                    <Button variant="ghost">
                      <Trash2 className="text-red-500" />
                    </Button>
                  </CustomAlertDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default WalletList;
