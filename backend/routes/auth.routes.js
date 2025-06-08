import express from "express";
import { register } from "../controllers/auth.controller.js";
import {login} from '../controllers/auth.controller.js'
import {verifyEmail} from "../controllers/auth.controller.js"


const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail)






export default router