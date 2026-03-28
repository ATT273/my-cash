import { Router } from "express";
import * as userRepo from "../repositories/user.repository";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = await userRepo.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const user = await userRepo.findByEmail(req.params.email);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await userRepo.update(req.params.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await userRepo.remove(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
});

export default router;
