import { Request, Response } from "express";
import * as userRepo from "../repositories/user.repository";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const users = await userRepo.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getByEmail = async (req: Request, res: Response) => {
  try {
    const user = await userRepo.findByEmail(req.params.email as string);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const user = await userRepo.findById(req.params.id as string);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await userRepo.update(req.params.id as string, req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await userRepo.remove(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
};
