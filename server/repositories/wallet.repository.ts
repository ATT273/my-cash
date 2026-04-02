import { prisma } from "../lib/prisma";

export type WalletCreateInput = {
  userId: string;
  walletName: string;
  amount?: number;
};

export type WalletUpdateInput = Partial<{
  walletName: string;
  amount: number;
}>;

export const findAll = () =>
  prisma.wallet.findMany({ orderBy: { createdAt: "desc" } });

export const findById = (id: string) =>
  prisma.wallet.findUnique({ where: { id } });

export const findByUserId = (userId: string) =>
  prisma.wallet.findMany({
    where: { userId },
    include: {
      budgets: {
        where: { status: true },
        select: { id: true, type: true, status: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

export const create = (data: WalletCreateInput) =>
  prisma.wallet.create({ data });

export const update = (id: string, data: WalletUpdateInput) =>
  prisma.wallet.update({ where: { id }, data });

export const remove = (id: string) =>
  prisma.wallet.delete({ where: { id } });
