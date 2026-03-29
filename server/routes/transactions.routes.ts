import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";

const router = Router();

router.get("/summary/monthly", transactionController.getMonthlySummary);
router.get("/summary/yearly", transactionController.getYearlySummary);
router.get("/search", transactionController.searchTransactions);
router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/", transactionController.removeAll);
router.delete("/:id", transactionController.remove);

export default router;
