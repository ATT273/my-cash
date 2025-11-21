export type TransactionType = "income" | "expense";
export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export type TransactionInput = Omit<
  ITransaction,
  "id" | "createdAt" | "updatedAt"
>;

export interface IFormData {
  type: "income" | "expense";
  category: string;
  amount: string;
  note: string;
  date: string;
}

export interface IUpdateTransactionInput {
  id: string;
  type: TransactionType;
  amount: string;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}
