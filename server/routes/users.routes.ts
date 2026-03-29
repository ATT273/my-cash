import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getAll);
router.get("/by-email/:email", userController.getByEmail);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
