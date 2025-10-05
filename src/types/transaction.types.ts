export type TransactionType = "income" | "expense";
export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category?: string;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export type TransactionInput = Omit<
  ITransaction,
  "id" | "createdAt" | "updatedAt"
>;
