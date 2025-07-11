import express from "express"
import {requestRide , acceptRide,arrivedAtPickup, startRide }  from "../controllers/ride.controller.js"
import {authenticate } from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"



const router = express.Router();


router.post("/" ,authenticate, requestRide)



router.post("/:rideId/accept", authenticate, authorize("driver"), acceptRide)
router.post("/:rideId/arrived", authorize("driver"), arrivedAtPickup)
router.post("/:rideId/start", authorize("driver"), startRide)


export default router
