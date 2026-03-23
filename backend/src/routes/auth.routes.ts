import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { IAuthController } from "../controllers/interface/auth.controller.interface";

const router = Router()
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
