import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, password, email } = req.body;
    const result = await authService.register({ userName, password, email });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const result = await authService.signIn(userName, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Sign in failed" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const result = await authService.signOut(userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const token = req.query.token as string;
    const valid = await authService.verifyToken(userId, token);
    res.json({ valid });
  } catch (error) {
    console.error(error);
    res.json({ valid: false });
  }
};
