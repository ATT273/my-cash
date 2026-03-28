import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetTransactions } from "@/hooks/transaction/UseGetTransactions";
import { useDeleteTransaction } from "@/hooks/transaction/UseDeleteTransaction";
import type { TransactionType } from "@/types/transaction.types";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Pen } from "lucide-react";
import EditTransactionForm from "../components/edit-transaction-form";
import CustomAlertDialog from "@/components/custom-components/AlertDialog";
import { toast } from "sonner";

const TransactionList = ({ type }: { type: TransactionType }) => {
  const { data: transactions = [] } = useGetTransactions();
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const list = transactions.filter((t) => t.type === type);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="w-[100px]">{t.category}</TableCell>
              <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
              <TableCell>{new Date(t.date).toDateString()}</TableCell>
              <TableCell>{t.note}</TableCell>
              <TableCell className="w-[50px]">
                <div className="flex gap-2">
                  <EditTransactionForm type={type} item={t}>
                    <Button variant="ghost">
                      <Pen className="text-green-500" />
                    </Button>
                  </EditTransactionForm>
                  <CustomAlertDialog
                    title={"Delete Transaction"}
                    description={"Are you sure you want to delete this transaction?"}
                    onConfirm={async () => {
                      try {
                        const result = await deleteTransaction(t.id);
                        if (result.success) {
                          toast.success("Transaction deleted");
                        } else {
                          toast.error("Failed to delete transaction");
                        }
                      } catch {
                        toast.error("Failed to delete transaction");
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
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionList;
