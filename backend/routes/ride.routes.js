import express from "express"
import {requestRide} from "../controllers/ride.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"



const router = express.Router();


router.post("/" ,authenticate, requestRide)

export default router
