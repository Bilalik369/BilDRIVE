import express from "express"
import {requestRide , acceptRide,arrivedAtPickup, startRide, completeRide , cancelRide, getRideById, getUserRides , getDriverRides ,rateRide}  from "../controllers/ride.controller.js"
import {authenticate } from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"



const router = express.Router();


router.post("/" ,authenticate, requestRide)



router.post("/:rideId/accept", authenticate, authorize("driver"), acceptRide)
router.post("/:rideId/arrived", authorize("driver"), arrivedAtPickup)
router.post("/:rideId/start", authorize("driver"), startRide)
router.post("/:rideId/complete", authorize("driver"), completeRide)

router.get("/driver", authorize("driver"), getDriverRides)

router.post("/:rideId/rate", rateRide)


router.get("/user", getUserRides)


router.post("/:rideId/cancel", cancelRide)




router.get("/:rideId", getRideById)


export default router
