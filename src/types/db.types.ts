import type { TransactionType } from "./transaction.types";

export interface IQueryResponse {
  values: (string | number)[][];
  columns: string[];
}

export interface IQueryParams {
  type?: TransactionType;
  from?: string;
  to?: string;
  category?: string;
}
