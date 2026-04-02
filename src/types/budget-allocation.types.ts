export interface JarFormData {
  name: string;
  color: string;
  icon: string;
}

export interface IBudgetAllocation {
  id: string;
  budgetId: string;
  jarId: string;
  amount: number;
  percentage: number | null;
}

export interface IJar {
  id: string;
  budgetId: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  allocation: IBudgetAllocation | null;
}

export interface IBudget {
  id: string;
  userId: string;
  walletId: string;
  type: "six_jar" | "three_jar" | "zero_based";
  status: boolean;
  startedAt: string;
  endedAt: string | null;
  jars: IJar[];
}

export interface CreateBudgetJarInput {
  name: string;
  icon: string;
  color: string;
  percentage: number | null;
  amount: number;
}

export interface CreateBudgetInput {
  walletId: string;
  userId: string;
  type: "six_jar" | "three_jar" | "zero_based";
  jars: CreateBudgetJarInput[];
}
