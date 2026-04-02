import { Request, Response } from "express";
import * as budgetRepo from "../repositories/budget.repository";

export const getActiveByWalletId = async (req: Request, res: Response) => {
  try {
    const budget = await budgetRepo.findActiveByWalletId(req.params.walletId);
    res.json(budget ?? null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
};

export const getAllByWalletId = async (req: Request, res: Response) => {
  try {
    const budgets = await budgetRepo.findAllByWalletId(req.params.walletId);
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const budget = await budgetRepo.create(req.body);
    res.json({ success: true, budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create budget" });
  }
};

export const archive = async (req: Request, res: Response) => {
  try {
    await budgetRepo.archive(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to archive budget" });
  }
};
