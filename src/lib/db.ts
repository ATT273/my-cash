import type { IQueryResponse } from "@/types/db.types";

export function queryAll(db: any, sql: string): Record<string, any>[] {
  const res = db.exec(sql);
  if (res.length === 0) return [];
  const { columns, values } = res[0] as IQueryResponse;
  return values.map((row) =>
    Object.fromEntries(row.map((val, i) => [columns[i], val]))
  );
}
