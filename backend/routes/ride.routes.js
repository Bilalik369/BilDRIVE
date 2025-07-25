import express from "express"
import {
  requestRide,
  acceptRide,
  arrivedAtPickup,
  startRide,
  completeRide,
  cancelRide,
  getRideById,
  getUserRides,
  getDriverRides,
  rateRide,
} from "../controllers/ride.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/role.middleware.js"


const router = express.Router()


router.use(authenticate)

// Passenger 
router.post("/",  requestRide)
router.get("/user", getUserRides)
router.post("/:rideId/cancel",  cancelRide)
router.post("/:rideId/rate",  rateRide)

// Driver 
router.post("/:rideId/accept", authorize("driver"), acceptRide)
router.post("/:rideId/arrived", authorize("driver"), arrivedAtPickup)
router.post("/:rideId/start", authorize("driver"), startRide)
router.post("/:rideId/complete", authorize("driver"), completeRide)
router.get("/driver", authorize("driver"), getDriverRides)

router.get("/:rideId", getRideById)

export default router
