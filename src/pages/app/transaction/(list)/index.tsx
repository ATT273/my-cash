import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "../../components/app-provider";
import type { TransactionType } from "@/types/transaction.types";
import { formatCurrency } from "@/utils";

const TransactionList = ({ type }: { type: TransactionType }) => {
  const { transactions } = useTransactions();
  console.log("Transactions from context:", transactions);
  const list = transactions.filter((t) => t.type === type);

  return (
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
            <TableCell className="text-right">
              {formatCurrency(t.amount)}
            </TableCell>
            <TableCell>{new Date(t.date).toDateString()}</TableCell>
            <TableCell>{t.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionList;
