import { Router } from "express";
import * as transactionRepo from "../repositories/transaction.repository";
import * as transactionService from "../services/transaction.service";

const router = Router();

router.get("/summary/monthly", async (req, res) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const result = await transactionService.getMonthlySummary(start, end);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get monthly summary" });
  }
});

router.get("/summary/yearly", async (req, res) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const result = await transactionService.getYearlySummary(start, end);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get yearly summary" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { type, from, to, category, walletId } = req.query as Record<string, string>;
    const transactions = await transactionRepo.findMany({ type: type as "income" | "expense", from, to, category, walletId });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search transactions" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const transactions = await transactionRepo.findAll();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const transaction = await transactionRepo.findById(req.params.id);
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { date, walletId, ...rest } = req.body;
    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
      res.status(400).json({ success: false, error: "Invalid or missing date" });
      return;
    }
    const data = {
      ...rest,
      date: parsedDate,
      ...(walletId != null && { walletId }),
    };
    const transaction = await transactionRepo.create(data);
    res.json({ success: true, transaction });
  } catch (error: unknown) {
    console.error("[POST /transactions] error:", JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, error: "Failed to create transaction" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const transaction = await transactionRepo.update(req.params.id, {
      ...rest,
      ...(date && { date: new Date(date) }),
    });
    res.json({ success: true, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update transaction" });
  }
});

router.delete("/", async (_req, res) => {
  try {
    await transactionRepo.removeAll();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to clear transactions" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await transactionRepo.remove(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete transaction" });
  }
});

export default router;
