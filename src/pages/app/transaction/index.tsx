import { Button } from "@/components/ui/button";
import TransactionList from "./(list)";
import NewTransactionForm from "./components/new-transaction-form";
import { Download } from "lucide-react";
import { useTransactions } from "../components/AppProvider";

const Transaction = () => {
  const { exportDB } = useTransactions();
  return (
    <div className="flex flex-col h-full gap-4">
      <p className="text-2xl font-bold">Transaction</p>
      <div className="w-full h-full flex gap-4">
        <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg">
          <NewTransactionForm />
        </div>
        <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">List of Transactions</p>
            <Button className="bg-green-500" onClick={() => exportDB()}>
              <Download />
            </Button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex-1">
              <p className="text-xl font-bold text-green-500">Income</p>
              <TransactionList type="income" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-red-500">Expense</p>
              <TransactionList type="expense" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
