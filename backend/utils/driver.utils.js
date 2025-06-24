import Driver from "../models/driver.model.js"


export const findNearbyDrivers = async (coordinates, vehicleType = null, deliveriesOnly = false) => {
  try {
    
    const query = {
      isAvailable: true,
      isVerified: true,
      status: "approved",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: 5000, 
        },
      },
    }

    
    if (vehicleType) {
      query["vehicle.type"] = vehicleType
    }

   
    if (deliveriesOnly) {
      query["services.deliveries"] = true
    }

   
    const drivers = await Driver.find(query).populate("user", "firstName lastName phone")

    return drivers
  } catch (error) {
    console.error("Error finding nearby drivers:", error)
    return []
  }
}


export const updateDriverLocation = async (driverId, coordinates) => {
  try {
    await Driver.findByIdAndUpdate(driverId, {
      currentLocation: {
        type: "Point",
        coordinates,
      },
    })
    return true
  } catch (error) {
    console.error("Error updating driver location:", error)
    return false
  }
}

export const getDriverAvailability = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId)
    return driver ? driver.isAvailable : false
  } catch (error) {
    console.error("Error getting driver availability:", error)
    return false
  }
}

export const toggleDriverAvailability = async (driverId, isAvailable) => {
  try {
    await Driver.findByIdAndUpdate(driverId, { isAvailable })
    return true
  } catch (error) {
    console.error("Error toggling driver availability:", error)
    return false
  }
}
