import { Router } from "express";
import * as authService from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const result = await authService.register({ userName, password, email });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const result = await authService.signIn(userName, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Sign in failed" });
  }
});

router.post("/signout", async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await authService.signOut(userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const { userId, token } = req.query as { userId: string; token: string };
    const valid = await authService.verifyToken(userId, token);
    res.json({ valid });
  } catch (error) {
    console.error(error);
    res.json({ valid: false });
  }
});

export default router;
