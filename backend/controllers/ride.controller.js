import Ride from "../models/ride.model.js";
import Driver from "../models/driver.model.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { createError } from "../utils/error.utils.js";
import { calculateRidePrice } from "../utils/pricing.utils.js";
import { getDistance, getDirections } from "../utils/maps.utils.js";
import { findNearbyDrivers } from "../utils/driver.utils.js";
import { createNotification } from "../utils/notification.utils.js";
import { sendToUser, sendToDrivers } from "../utils/realtime.utils.js";
// import { sendPushNotification } from "../utils/firebase.utils.js"

export const requestRide = async (req, res, next) => {
  try {
    const {
      pickup,
      destination,
      scheduledTime,
      vehicleType,
      passengers,
      paymentMethod,
      notes,
    } = req.body;

    const { distance, duration } = await getDistance(
      pickup.location.coordinates,
      destination.location.coordinates,
    );

    const routeInfo = await getDirections(
      pickup.location.coordinates,
      destination.location.coordinates,
    );

    const price = calculateRidePrice(distance, duration, vehicleType);

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
    });

    await ride.save();

    if (scheduledTime) {
      await createNotification({
        recipient: req.user.id,
        title: "Course programmée",
        message: `Votre course pour ${new Date(scheduledTime).toLocaleString()} a été programmée`,
        type: "ride_scheduled",
        reference: ride._id,
        referenceModel: "Ride",
      });

      res.status(201).json({
        success: true,
        message: "Course programmée avec succès",
        ride,
      });
      return;
    }

    const nearbyDrivers = await findNearbyDrivers(
      pickup.location.coordinates,
      vehicleType,
    );

    if (nearbyDrivers.length === 0) {
      ride.status = "noDriver";
      await ride.save();

      await createNotification({
        recipient: req.user.id,
        title: "Aucun chauffeur disponible",
        message:
          "Aucun chauffeur n'est actuellement disponible dans votre zone. Veuillez réessayer plus tard.",
        type: "ride_cancelled",
        reference: ride._id,
        referenceModel: "Ride",
      });

      return res.status(200).json({
        success: false,
        message: "Aucun chauffeur disponible",
        ride,
      });
    }

    ride.status = "searching";
    await ride.save();

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
      });

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
      });

      sendToUser(driver.user.toString(), "new_ride_request", {
        rideId: ride._id,
        pickup: ride.pickup,
        destination: ride.destination,
        price: ride.price.total,
        distance: ride.distance,
        duration: ride.duration,
      });
    }

    sendToUser(req.user.id, "ride_searching", {
      rideId: ride._id,
      driversFound: nearbyDrivers.length,
    });

    res.status(201).json({
      success: true,
      message: "Course demandée avec succès",
      ride,
      driversFound: nearbyDrivers.length,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate(
      "passenger",
      "firstName lastName phone",
    );
    if (!ride) {
      return next(createError(404, "Course non trouvée"));
    }

    if (ride.status !== "searching") {
      return next(createError(400, "Course non disponible"));
    }

    const driver = await Driver.findOne({ user: req.user.id }).populate("user");
    if (!driver) {
      return next(createError(404, "Chauffeur non trouvé"));
    }

    if (!driver.isAvailable || driver.status !== "approved") {
      return next(createError(400, "Chauffeur non disponible"));
    }

    ride.driver = driver._id;
    ride.status = "accepted";
    ride.acceptedAt = new Date();
    await ride.save();

    driver.isAvailable = false;
    driver.currentRide = ride._id;
    await driver.save();

    await createNotification({
      recipient: ride.passenger._id,
      title: "Course acceptée",
      message: `${driver.user.firstName} a accepté votre course`,
      type: "ride_accepted",
      reference: ride._id,
      referenceModel: "Ride",
      data: {
        rideId: ride._id,
        driverId: driver._id,
        driverName: driver.user.firstName + " " + driver.user.lastName,
        driverPhone: driver.user.phone,
        driverRating: driver.user.rating,
        vehicleInfo: driver.vehicle,
        estimatedArrival: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendPushNotification(ride.passenger._id.toString(), {
      title: "Course acceptée",
      body: `${driver.user.firstName} a accepté votre course`,
      data: {
        type: "ride_accepted",
        rideId: ride._id.toString(),
        driverId: driver._id.toString(),
        driverName: driver.user.firstName + " " + driver.user.lastName,
        driverPhone: driver.user.phone,
      },
    });

    sendToUser(ride.passenger._id.toString(), "ride_accepted", {
      rideId: ride._id,
      driver: {
        id: driver._id,
        name: driver.user.firstName + " " + driver.user.lastName,
        phone: driver.user.phone,
        rating: driver.user.rating,
        profilePicture: driver.user.profilePicture,
        vehicle: driver.vehicle,
      },
    });

    sendToDrivers("drivers", "ride_taken", { rideId: ride._id });

    res.status(200).json({
      success: true,
      message: "Course acceptée avec succès",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

export const arrivedAtPickup = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate("passenger");
    if (!ride) {
      return next(createError(404, "Course non trouvée"));
    }

    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver || !ride.driver.equals(driver._id)) {
      return next(createError(403, "Non autorisé à modifier cette course"));
    }

    if (ride.status !== "accepted") {
      return next(createError(400, "Statut de course incorrect"));
    }

    ride.status = "arrived";
    ride.arrivedAt = new Date();
    await ride.save();

    await createNotification({
      recipient: ride.passenger._id,
      title: "Chauffeur arrivé",
      message: "Votre chauffeur est arrivé au point de prise en charge",
      type: "ride_arrived",
      reference: ride._id,
      referenceModel: "Ride",
    });

    await sendPushNotification(ride.passenger._id.toString(), {
      title: "Chauffeur arrivé",
      body: "Votre chauffeur est arrivé au point de prise en charge",
      data: {
        type: "ride_arrived",
        rideId: ride._id.toString(),
      },
    });

    sendToUser(ride.passenger._id.toString(), "driver_arrived", {
      rideId: ride._id,
      message: "Votre chauffeur est arrivé",
    });

    res.status(200).json({
      success: true,
      message: "Arrivée confirmée avec succès",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

export const startRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate("passenger");
    if (!ride) {
      return next(createError(404, "Course non trouvée"));
    }

    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver || !ride.driver.equals(driver._id)) {
      return next(createError(403, "Non autorisé à modifier cette course"));
    }

    if (ride.status !== "arrived") {
      return next(createError(400, "Statut de course incorrect"));
    }

    ride.status = "inProgress";
    ride.pickupTime = new Date();
    await ride.save();

    await createNotification({
      recipient: ride.passenger._id,
      title: "Course commencée",
      message: "Votre course a commencé",
      type: "ride_started",
      reference: ride._id,
      referenceModel: "Ride",
    });

    await sendPushNotification(ride.passenger._id.toString(), {
      title: "Course commencée",
      body: "Votre course a commencé",
      data: {
        type: "ride_started",
        rideId: ride._id.toString(),
      },
    });

    sendToUser(ride.passenger._id.toString(), "ride_started", {
      rideId: ride._id,
      message: "Votre course a commencé",
    });

    res.status(200).json({
      success: true,
      message: "Course commencée avec succès",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

export const completeRide = async (req, res, next) => {
  try {
    const { rideId } = req.params

   
    const ride = await Ride.findById(rideId).populate("passenger")
    if (!ride) {
      return next(createError(404, "Course non trouvée"))
    }

   
    const driver = await Driver.findOne({ user: req.user.id }).populate("user")
    if (!driver || !ride.driver.equals(driver._id)) {
      return next(createError(403, "Non autorisé à modifier cette course"))
    }


    if (ride.status !== "inProgress") {
      return next(createError(400, "Statut de course incorrect"))
    }


    ride.status = "completed"
    ride.dropoffTime = new Date()
    await ride.save()

    if (ride.payment.method !== "cash") {
      try {
        const paymentResult = await processPayment({
          amount: ride.price.total,
          currency: "EUR",
          user: ride.passenger,
          description: `Course de ${ride.pickup.address} vers ${ride.destination.address}`,
          paymentMethod: ride.payment.method,
        })

        ride.payment.status = paymentResult.status
        ride.payment.transactionId = paymentResult.transactionId
        await ride.save()

        
        const payment = new Payment({
          user: ride.passenger._id,
          type: "ride",
          amount: ride.price.total,
          status: paymentResult.status,
          method: ride.payment.method,
          transactionId: paymentResult.transactionId,
          reference: ride._id,
          referenceModel: "Ride",
        })
        await payment.save()

       
        if (paymentResult.status === "completed") {
          const receipt = await generateRideReceipt(ride)
          payment.receipt = {
            url: receipt,
            generatedAt: new Date(),
          }
          await payment.save()
        }
      } catch (paymentError) {
        console.error("Payment processing error:", paymentError)
        ride.payment.status = "failed"
        await ride.save()
      }
    } else {
      
      ride.payment.status = "cash_pending"
      await ride.save()
    }

   
    driver.completedRides += 1
    driver.isAvailable = true
    driver.currentRide = null
    driver.balance += ride.price.total * 0.8 
    await driver.save()

   
    await createNotification({
      recipient: ride.passenger._id,
      title: "Course terminée",
      message: "Votre course s'est terminée avec succès",
      type: "ride_completed",
      reference: ride._id,
      referenceModel: "Ride",
    })

    
    await sendPushNotification(ride.passenger._id.toString(), {
      title: "Course terminée",
      body: "Votre course s'est terminée avec succès",
      data: {
        type: "ride_completed",
        rideId: ride._id.toString(),
        paymentStatus: ride.payment.status,
      },
    })

    sendToUser(ride.passenger._id.toString(), "ride_completed", {
      rideId: ride._id,
      message: "Course terminée avec succès",
      paymentStatus: ride.payment.status,
    })

    res.status(200).json({
      success: true,
      message: "Course terminée avec succès",
      ride,
    })
  } catch (error) {
    next(error)
  }
}
export const cancelRide = async (req, res, next) => {
  try {
    const { rideId } = req.params
    const { reason } = req.body

   
    const ride = await Ride.findById(rideId).populate("passenger")
    if (!ride) {
      return next(createError(404, "Course non trouvée"))
    }

    const isPassenger = ride.passenger._id.equals(req.user.id)
    const driver = await Driver.findOne({ user: req.user.id })
    const isDriver = driver && ride.driver && ride.driver.equals(driver._id)

    if (!isPassenger && !isDriver) {
      return next(createError(403, "Non autorisé à annuler cette course"))
    }

  
    if (["completed", "cancelled", "noDriver"].includes(ride.status)) {
      return next(createError(400, "Course ne peut pas être annulée"))
    }


    ride.status = "cancelled"
    ride.cancelledBy = isPassenger ? "passenger" : "driver"
    ride.cancellationReason = reason || "Aucune raison fournie"
    ride.cancelledAt = new Date()
    await ride.save()

   
    if (isDriver) {
      driver.isAvailable = true
      driver.currentRide = null
      await driver.save()

    
      await createNotification({
        recipient: ride.passenger._id,
        title: "Course annulée",
        message: "Votre course a été annulée par le chauffeur",
        type: "ride_cancelled",
        reference: ride._id,
        referenceModel: "Ride",
      })

 
      await sendPushNotification(ride.passenger._id.toString(), {
        title: "Course annulée",
        body: "Votre course a été annulée par le chauffeur",
        data: {
          type: "ride_cancelled",
          rideId: ride._id.toString(),
          reason: reason || "Annulée par le chauffeur",
        },
      })

    
      sendToUser(ride.passenger._id.toString(), "ride_cancelled", {
        rideId: ride._id,
        reason: reason || "Annulée par le chauffeur",
      })
    }

    if (isPassenger && ride.driver) {
      
      const rideDriver = await Driver.findById(ride.driver)
      if (rideDriver) {
        rideDriver.isAvailable = true
        rideDriver.currentRide = null
        await rideDriver.save()
      }

      
      await createNotification({
        recipient: rideDriver.user,
        title: "Course annulée",
        message: "Une course a été annulée par le passager",
        type: "ride_cancelled",
        reference: ride._id,
        referenceModel: "Ride",
      })

    
      await sendPushNotification(rideDriver.user.toString(), {
        title: "Course annulée",
        body: "Une course a été annulée par le passager",
        data: {
          type: "ride_cancelled",
          rideId: ride._id.toString(),
          reason: reason || "Annulée par le passager",
        },
      })

      
      sendToUser(rideDriver.user.toString(), "ride_cancelled", {
        rideId: ride._id,
        reason: reason || "Annulée par le passager",
      })
    }

    res.status(200).json({
      success: true,
      message: "Course annulée avec succès",
      ride,
    })
  } catch (error) {
    next(error)
  }
}


export const getRideById = async (req, res, next) => {
  try {
    const { rideId } = req.params

    const ride = await Ride.findById(rideId)
      .populate("passenger", "firstName lastName phone profilePicture rating")
      .populate({
        path: "driver",
        populate: {
          path: "user",
          select: "firstName lastName phone profilePicture rating",
        },
      })

    if (!ride) {
      return next(createError(404, "Course non trouvée"))
    }


    const isPassenger = ride.passenger._id.equals(req.user.id)
    const driver = await Driver.findOne({ user: req.user.id })
    const isDriver = driver && ride.driver && ride.driver._id.equals(driver._id)
    const isAdmin = req.user.role === "admin"

    if (!isPassenger && !isDriver && !isAdmin) {
      return next(createError(403, "Non autorisé à voir cette course"))
    }

    res.status(200).json({
      success: true,
      ride,
    })
  } catch (error) {
    next(error)
  }
}


export const getUserRides = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query
    const skip = (page - 1) * limit

    const query = { passenger: req.user.id }
    if (status) {
      query.status = status
    }

    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate({
        path: "driver",
        populate: {
          path: "user",
          select: "firstName lastName profilePicture rating",
        },
      })

    const total = await Ride.countDocuments(query)

    res.status(200).json({
      success: true,
      rides,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        limit: Number.parseInt(limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getDriverRides = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query
    const skip = (page - 1) * limit

    
    const driver = await Driver.findOne({ user: req.user.id })
    if (!driver) {
      return next(createError(404, "Chauffeur non trouvé"))
    }


    const query = { driver: driver._id }
    if (status) {
      query.status = status
    }

   
    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("passenger", "firstName lastName profilePicture rating")

    const total = await Ride.countDocuments(query)

    res.status(200).json({
      success: true,
      rides,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        limit: Number.parseInt(limit),
      },
    })
  } catch (error) {
    next(error)
  }
}


export const rateRide = async (req, res, next) => {
  try {
    const { rideId } = req.params
    const { rating, comment } = req.body


    if (rating < 1 || rating > 5) {
      return next(createError(400, "La note doit être entre 1 et 5"))
    }


    const ride = await Ride.findById(rideId)
    if (!ride) {
      return next(createError(404, "Course non trouvée"))
    }

    if (ride.status !== "completed") {
      return next(createError(400, "Course non terminée"))
    }


    const isPassenger = ride.passenger.equals(req.user.id)
    const driver = await Driver.findOne({ user: req.user.id })
    const isDriver = driver && ride.driver.equals(driver._id)

    if (!isPassenger && !isDriver) {
      return next(createError(403, "Non autorisé à noter cette course"))
    }


    if (isPassenger) {
   
      if (ride.rating.passenger) {
        return next(createError(400, "Vous avez déjà noté cette course"))
      }

      ride.rating.passenger = {
        value: rating,
        comment,
        createdAt: new Date(),
      }

    
      const rideDriver = await Driver.findById(ride.driver).populate("user")
      if (rideDriver) {
        const user = await User.findById(rideDriver.user._id)
        const currentRating = user.rating || 0
        const currentCount = user.ratingCount || 0
        const newCount = currentCount + 1
        const newRating = (currentRating * currentCount + rating) / newCount

        user.rating = Math.round(newRating * 10) / 10 
        user.ratingCount = newCount
        await user.save()
      }
    } else {
      
      if (ride.rating.driver) {
        return next(createError(400, "Vous avez déjà noté cette course"))
      }

      ride.rating.driver = {
        value: rating,
        comment,
        createdAt: new Date(),
      }

    
      const user = await User.findById(ride.passenger)
      const currentRating = user.rating || 0
      const currentCount = user.ratingCount || 0
      const newCount = currentCount + 1
      const newRating = (currentRating * currentCount + rating) / newCount

      user.rating = Math.round(newRating * 10) / 10 
      user.ratingCount = newCount
      await user.save()
    }

    await ride.save()

    res.status(200).json({
      success: true,
      message: "Course notée avec succès",
      ride,
    })
  } catch (error) {
    next(error)
  }
}





