import Ride from "../models/ride.model.js"
import Driver from "../models/driver.model.js"
import User from "../models/user.model.js"
import Payment from "../models/payment.model.js"
import { createError } from "../utils/error.utils.js"
import { calculateRidePrice } from "../utils/pricing.utils.js"
import { getDistance, getDirections } from "../utils/maps.utils.js"
import { findNearbyDrivers } from "../utils/driver.utils.js"
import { createNotification } from "../utils/notification.utils.js"
import { sendToUser } from "../utils/realtime.utils.js"
import { sendPushNotification } from "../utils/firebase.utils.js"

export const requestRide = async (req, res, next) => {
    try {
      const { pickup, destination, scheduledTime, vehicleType, passengers, paymentMethod, notes } = req.body
  
     
      const { distance, duration } = await getDistance(pickup.location.coordinates, destination.location.coordinates)
  
    
      const routeInfo = await getDirections(pickup.location.coordinates, destination.location.coordinates)
  
      
      const price = calculateRidePrice(distance, duration, vehicleType)
  
     
      const ride = new Ride({
        passenger: req.user.id,
        pickup,
        destination,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        vehicleType: vehicleType || "standard",
        passengers: passengers || 1,
        price: {
          base: price.base,
          distance: price.distance,
          time: price.time,
          total: price.total,
        },
        distance,
        duration,
        route: {
          polyline: routeInfo.polyline,
          steps: routeInfo.steps,
        },
        payment: {
          method: paymentMethod || "card",
        },
        notes,
        status: scheduledTime ? "scheduled" : "requested",
      })
  
      await ride.save()
  
      if (scheduledTime) {
      
        await createNotification({
          recipient: req.user.id,
          title: "Course programmée",
          message: `Votre course pour ${new Date(scheduledTime).toLocaleString()} a été programmée`,
          type: "ride_scheduled",
          reference: ride._id,
          referenceModel: "Ride",
        })
  
        res.status(201).json({
          success: true,
          message: "Course programmée avec succès",
          ride,
        })
        return
      }
  
    
      const nearbyDrivers = await findNearbyDrivers(pickup.location.coordinates, vehicleType)
  
      if (nearbyDrivers.length === 0) {
       
        ride.status = "noDriver"
        await ride.save()
  
        await createNotification({
          recipient: req.user.id,
          title: "Aucun chauffeur disponible",
          message: "Aucun chauffeur n'est actuellement disponible dans votre zone. Veuillez réessayer plus tard.",
          type: "ride_cancelled",
          reference: ride._id,
          referenceModel: "Ride",
        })
  
        return res.status(200).json({
          success: false,
          message: "Aucun chauffeur disponible",
          ride,
        })
      }
  
      ride.status = "searching"
      await ride.save()
  
     
      for (const driver of nearbyDrivers) {
        await createNotification({
          recipient: driver.user,
          title: "Nouvelle demande de course",
          message: `Nouvelle course de ${pickup.address} vers ${destination.address}`,
          type: "ride_request",
          reference: ride._id,
          referenceModel: "Ride",
          data: {
            rideId: ride._id,
            pickup: ride.pickup,
            destination: ride.destination,
            price: ride.price.total,
            distance: ride.distance,
            duration: ride.duration,
          },
        })
  
      
        await sendPushNotification(driver.user.toString(), {
          title: "Nouvelle demande de course",
          body: `Course de ${pickup.address} vers ${destination.address} - €${ride.price.total}`,
          data: {
            type: "ride_request",
            rideId: ride._id.toString(),
            pickup: JSON.stringify(ride.pickup),
            destination: JSON.stringify(ride.destination),
            price: ride.price.total.toString(),
          },
        })
  
        
        sendToUser(driver.user.toString(), "new_ride_request", {
          rideId: ride._id,
          pickup: ride.pickup,
          destination: ride.destination,
          price: ride.price.total,
          distance: ride.distance,
          duration: ride.duration,
        })
      }
  
     
      sendToUser(req.user.id, "ride_searching", {
        rideId: ride._id,
        driversFound: nearbyDrivers.length,
      })
  
      res.status(201).json({
        success: true,
        message: "Course demandée avec succès",
        ride,
        driversFound: nearbyDrivers.length,
      })
    } catch (error) {
      next(error)
    }
  }