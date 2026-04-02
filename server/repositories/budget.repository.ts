import { prisma } from "../lib/prisma";

export type JarInput = {
  name: string;
  icon: string;
  color: string;
  percentage: number | null;
  amount: number;
};

export type BudgetCreateInput = {
  walletId: string;
  userId: string;
  type: "six_jar" | "three_jar" | "zero_based";
  jars: JarInput[];
};

export const findActiveByWalletId = (walletId: string) =>
  prisma.budget.findFirst({
    where: { walletId, status: true },
    include: {
      jars: { include: { allocation: true } },
    },
  });

export const findAllByWalletId = (walletId: string) =>
  prisma.budget.findMany({
    where: { walletId },
    include: {
      jars: { include: { allocation: true } },
    },
    orderBy: { startedAt: "desc" },
  });

export const create = async (data: BudgetCreateInput) => {
  return prisma.$transaction(async (tx) => {
    const budget = await tx.budget.create({
      data: {
        walletId: data.walletId,
        userId: data.userId,
        type: data.type,
        status: true,
        startedAt: new Date(),
      },
    });

    for (const jarInput of data.jars) {
      const jar = await tx.jar.create({
        data: {
          budgetId: budget.id,
          name: jarInput.name,
          icon: jarInput.icon,
          color: jarInput.color,
        },
      });

      await tx.budgetAllocation.create({
        data: {
          budgetId: budget.id,
          jarId: jar.id,
          amount: jarInput.amount,
          percentage: jarInput.percentage ?? null,
        },
      });
    }

    return tx.budget.findUnique({
      where: { id: budget.id },
      include: {
        jars: { include: { allocation: true } },
      },
    });
  });
};

export const archive = (id: string) =>
  prisma.budget.update({
    where: { id },
    data: { status: false, endedAt: new Date() },
  });
