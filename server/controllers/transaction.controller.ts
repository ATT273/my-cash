import { Request, Response } from "express";
import * as transactionRepo from "../repositories/transaction.repository";
import * as transactionService from "../services/transaction.service";
import { prisma } from "../lib/prisma";

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const result = await transactionService.getMonthlySummary(start, end);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get monthly summary" });
  }
};

export const getYearlySummary = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const result = await transactionService.getYearlySummary(start, end);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get yearly summary" });
  }
};

export const searchTransactions = async (req: Request, res: Response) => {
  try {
    const { type, from, to, category, walletId } = req.query as Record<string, string>;
    const transactions = await transactionRepo.findMany({
      type: type as "income" | "expense",
      from,
      to,
      category,
      walletId,
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search transactions" });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const transactions = await transactionRepo.findAll();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionRepo.findById(req.params.id as string);
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { date, walletId, ...rest } = req.body;
    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
      res.status(400).json({ success: false, error: "Invalid or missing date" });
      return;
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: { ...rest, date: parsedDate, ...(walletId != null && { walletId }) },
      });

      if (walletId) {
        const amountDelta = created.type === "income" ? created.amount : -created.amount;
        await tx.wallet.update({
          where: { id: walletId },
          data: { amount: { increment: amountDelta } },
        });
      }

      return created;
    });

    res.json({ success: true, transaction });
  } catch (error: unknown) {
    console.error("[create transaction] error:", JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, error: "Failed to create transaction" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { date, ...rest } = req.body;
    const updateData = { ...rest, ...(date && { date: new Date(date) }) };

    const transaction = await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { id: req.params.id as string } });
      if (!existing) throw new Error("Transaction not found");

      const updated = await tx.transaction.update({ where: { id: req.params.id as string }, data: updateData });

      if (existing.walletId && (updateData.amount !== undefined || updateData.type !== undefined)) {
        const oldEffect = existing.type === "income" ? existing.amount : -existing.amount;
        const newType = updateData.type ?? existing.type;
        const newAmount = updateData.amount ?? existing.amount;
        const newEffect = newType === "income" ? newAmount : -newAmount;
        const delta = newEffect - oldEffect;

        if (delta !== 0) {
          await tx.wallet.update({
            where: { id: existing.walletId },
            data: { amount: { increment: delta } },
          });
        }
      }

      return updated;
    });

    res.json({ success: true, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update transaction" });
  }
};

export const removeAll = async (_req: Request, res: Response) => {
  try {
    await transactionRepo.removeAll();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to clear transactions" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { id: req.params.id as string } });
      if (!existing) throw new Error("Transaction not found");

      await tx.transaction.delete({ where: { id: req.params.id as string } });

      if (existing.walletId) {
        const amountDelta = existing.type === "income" ? -existing.amount : existing.amount;
        await tx.wallet.update({
          where: { id: existing.walletId },
          data: { amount: { increment: amountDelta } },
        });
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete transaction" });
  }
};
