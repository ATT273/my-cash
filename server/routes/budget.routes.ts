import { Router } from "express";
import * as budgetController from "../controllers/budget.controller";

const router = Router();

router.get("/by-wallet/:walletId", budgetController.getActiveByWalletId);
router.get("/list/:walletId", budgetController.getAllByWalletId);
router.post("/", budgetController.create);
router.put("/:id/archive", budgetController.archive);

export default router;
