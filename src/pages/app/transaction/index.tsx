import TransactionList from "./(list)";
import NewTransactionForm from "./components/new-transaction-form";
import WalletButton from "../wallet/components/WalletButton";
import { useCurrentWallet } from "@/hooks/wallet/UseCurrentWallet";
import { useGetBudgetsByWallet } from "@/hooks/budget/UseGetBudgetsByWallet";

const Transaction = () => {
  const { currentWalletId } = useCurrentWallet();
  const { data: budgets = [] } = useGetBudgetsByWallet(currentWalletId);
  const activeBudgetId = budgets.find((b) => b.status)?.id;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Transaction</p>
        <WalletButton />
      </div>
      <div className="w-full h-full flex gap-4">
        <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg">
          <NewTransactionForm />
        </div>
        <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg overflow-y-auto">
          <p className="text-2xl font-bold">List of Transactions</p>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <TransactionList type="income" budgets={budgets} activeBudgetId={activeBudgetId} />
            </div>
            <div className="flex flex-col gap-2">
              <TransactionList type="expense" budgets={budgets} activeBudgetId={activeBudgetId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
