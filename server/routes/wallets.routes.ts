import { Router } from "express";
import * as walletController from "../controllers/wallet.controller";

const router = Router();

router.get("/", walletController.getAll);
router.get("/by-user/:userId", walletController.getByUserId);
router.get("/:id", walletController.getById);
router.post("/", walletController.create);
router.put("/:id", walletController.update);
router.delete("/:id", walletController.remove);

export default router;
