import { prisma } from "../lib/prisma";

export type TransactionType = "income" | "expense";

export type TransactionCreateInput = {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  walletId?: string | null;
};

export type TransactionUpdateInput = Partial<{
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: Date;
}>;

export type TransactionQueryParams = {
  type?: TransactionType;
  from?: string;
  to?: string;
  category?: string;
  walletId?: string;
};

export const findAll = () =>
  prisma.transaction.findMany({ orderBy: { date: "desc" } });

export const findById = (id: string) =>
  prisma.transaction.findUnique({ where: { id } });

export const findMany = (params: TransactionQueryParams) =>
  prisma.transaction.findMany({
    where: {
      ...(params.type && { type: params.type }),
      ...(params.walletId && { walletId: params.walletId }),
      ...(params.category && { category: params.category }),
      ...((params.from || params.to) && {
        date: {
          ...(params.from && { gte: new Date(params.from) }),
          ...(params.to && { lte: new Date(params.to) }),
        },
      }),
    },
    orderBy: { date: "desc" },
  });

export const create = (data: TransactionCreateInput) =>
  prisma.transaction.create({ data });

export const update = (id: string, data: TransactionUpdateInput) =>
  prisma.transaction.update({ where: { id }, data });

export const remove = (id: string) =>
  prisma.transaction.delete({ where: { id } });

export const removeAll = () => prisma.transaction.deleteMany();
