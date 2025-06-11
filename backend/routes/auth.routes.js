import express from "express";
import { register , login , verifyEmail, resendVerificationEmail ,forgotPassword, resetPassword , socialLogin} from "../controllers/auth.controller.js";

 


const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail)
router.post("/resend-verification",  resendVerificationEmail)
router.post("/forgot-password",  forgotPassword)
router.post("/reset-password/:token",  resetPassword)
router.post("/social-login",  socialLogin);






export default router