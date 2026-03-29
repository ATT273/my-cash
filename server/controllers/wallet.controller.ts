import { Request, Response } from "express";
import * as walletRepo from "../repositories/wallet.repository";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const wallets = await walletRepo.findAll();
    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
};

export const getByUserId = async (req: Request, res: Response) => {
  try {
    const wallets = await walletRepo.findByUserId(req.params.userId as string);
    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const wallet = await walletRepo.findById(req.params.id as string);
    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const wallet = await walletRepo.create(req.body);
    res.json({ success: true, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create wallet" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const wallet = await walletRepo.update(req.params.id as string, req.body);
    res.json({ success: true, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update wallet" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await walletRepo.remove(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete wallet" });
  }
};
