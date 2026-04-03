import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);
router.get("/verify", authController.verifyToken);
router.post("/change-password", authController.changePassword);

export default router;
