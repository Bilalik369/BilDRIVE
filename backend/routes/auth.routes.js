import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  socialLogin,
  getCurrentUser,
  changePassword,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  emailSchema,
  socialLoginSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/social-login", socialLogin);

router.get("/verify", authenticate, getCurrentUser);
router.get("/me", authenticate, getCurrentUser);
router.put("/change-password", authenticate, changePassword);
router.post("/logout", authenticate, logout);

export default router;
