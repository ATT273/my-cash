export type TransactionType = "income" | "expense";
export interface ITransaction {
  id: string;
  walletId: string;
  jarId?: string | null;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JarAllocationInput {
  jarId: string;
  amount: number;
}

export type TransactionInput = Omit<ITransaction, "id" | "createdAt" | "updatedAt"> & {
  jarAllocations?: JarAllocationInput[];
};

export interface IFormData {
  type: "income" | "expense";
  category: string;
  amount: string;
  note: string;
  date: string;
  jarId?: string;
}

export interface IUpdateTransactionInput {
  id: string;
  type: TransactionType;
  amount: string;
  category: string;
  note: string;
  date: string;
}
