import { Router } from "express";
import * as walletRepo from "../repositories/wallet.repository";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const wallets = await walletRepo.findAll();
    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
});

router.get("/by-user/:userId", async (req, res) => {
  try {
    const wallets = await walletRepo.findByUserId(req.params.userId);
    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const wallet = await walletRepo.findById(req.params.id);
    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

router.post("/", async (req, res) => {
  try {
    const wallet = await walletRepo.create(req.body);
    res.json({ success: true, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create wallet" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const wallet = await walletRepo.update(req.params.id, req.body);
    res.json({ success: true, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update wallet" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await walletRepo.remove(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete wallet" });
  }
});

export default router;
