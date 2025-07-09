import express from "express"
import {requestRide , acceptRide, }  from "../controllers/ride.controller.js"
import {authenticate } from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"



const router = express.Router();


router.post("/" ,authenticate, requestRide)



router.post("/:rideId/accept", authorize("driver"), acceptRide)

export default router
