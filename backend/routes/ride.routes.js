import express from "express"
import {requestRide} from "../controllers/ride.controller.js"



const router = express.Router();


router.post("/" , requestRide)

export default router
