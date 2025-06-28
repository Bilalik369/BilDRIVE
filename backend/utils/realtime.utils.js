import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Driver from "../models/driver.model.js"

let io = null

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  })

 
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1]

      if (!token) {
        return next(new Error("Authentication token required"))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)

      if (!user) {
        return next(new Error("User not found"))
      }

      socket.userId = user._id.toString()
      socket.userRole = user.role
      socket.user = user

      next()
    } catch (error) {
      next(new Error("Invalid authentication token"))
    }
  })

 
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`)

    
    socket.join(`user:${socket.userId}`)

    
    if (socket.userRole === "driver") {
      socket.join("drivers")
    }

 
    if (socket.userRole === "admin") {
      socket.join("admins")
    }

   
    socket.on("location:update", async (data) => {
      if (socket.userRole !== "driver") {
        return socket.emit("error", { message: "Only drivers can update location" })
      }

      try {
        const { latitude, longitude, heading, speed } = data

       
        if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          return socket.emit("error", { message: "Invalid coordinates" })
        }

        await Driver.findOneAndUpdate(
          { user: socket.userId },
          {
            currentLocation: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            heading: heading || 0,
            speed: speed || 0,
            lastLocationUpdate: new Date(),
          },
        )

        
        socket.broadcast.emit("driver:location", {
          driverId: socket.userId,
          location: { latitude, longitude },
          heading,
          speed,
          timestamp: new Date(),
        })

        socket.emit("location:updated", { success: true })
      } catch (error) {
        console.error("Error updating location:", error)
        socket.emit("error", { message: "Failed to update location" })
      }
    })

    socket.on("ride:request", (data) => {
    
      socket.to("drivers").emit("ride:new_request", {
        rideId: data.rideId,
        pickup: data.pickup,
        destination: data.destination,
        passenger: {
          id: socket.userId,
          name: socket.user.firstName + " " + socket.user.lastName,
        },
        price: data.price,
        timestamp: new Date(),
      })
    })


    socket.on("ride:accept", (data) => {
      
      socket.to(`user:${data.passengerId}`).emit("ride:accepted", {
        rideId: data.rideId,
        driver: {
          id: socket.userId,
          name: socket.user.firstName + " " + socket.user.lastName,
          phone: socket.user.phone,
        },
        timestamp: new Date(),
      })

      socket.to("drivers").emit("ride:taken", {
        rideId: data.rideId,
        timestamp: new Date(),
      })
    })

   
    socket.on("ride:status", (data) => {
      const { rideId, status, passengerId, driverId } = data

      if (passengerId) {
        socket.to(`user:${passengerId}`).emit("ride:status_update", {
          rideId,
          status,
          timestamp: new Date(),
        })
      }

      if (driverId && driverId !== socket.userId) {
        socket.to(`user:${driverId}`).emit("ride:status_update", {
          rideId,
          status,
          timestamp: new Date(),
        })
      }
    })

  
    socket.on("delivery:request", (data) => {
      socket.to("drivers").emit("delivery:new_request", {
        deliveryId: data.deliveryId,
        pickup: data.pickup,
        destination: data.destination,
        package: data.package,
        sender: {
          id: socket.userId,
          name: socket.user.firstName + " " + socket.user.lastName,
        },
        price: data.price,
        timestamp: new Date(),
      })
    })

    socket.on("delivery:status", (data) => {
      const { deliveryId, status, senderId, driverId } = data

      if (senderId) {
        socket.to(`user:${senderId}`).emit("delivery:status_update", {
          deliveryId,
          status,
          timestamp: new Date(),
        })
      }

      if (driverId && driverId !== socket.userId) {
        socket.to(`user:${driverId}`).emit("delivery:status_update", {
          deliveryId,
          status,
          timestamp: new Date(),
        })
      }
    })

  
    socket.on("chat:message", (data) => {
      const { recipientId, message, rideId, deliveryId } = data

      socket.to(`user:${recipientId}`).emit("chat:new_message", {
        senderId: socket.userId,
        senderName: socket.user.firstName + " " + socket.user.lastName,
        message,
        rideId,
        deliveryId,
        timestamp: new Date(),
      })
    })

  
    socket.on("driver:availability", async (data) => {
      if (socket.userRole !== "driver") {
        return socket.emit("error", { message: "Only drivers can update availability" })
      }

      try {
        const { isAvailable } = data

        await Driver.findOneAndUpdate({ user: socket.userId }, { isAvailable })

        socket.emit("driver:availability_updated", { isAvailable, success: true })

        
        socket.to("admins").emit("driver:availability_change", {
          driverId: socket.userId,
          driverName: socket.user.firstName + " " + socket.user.lastName,
          isAvailable,
          timestamp: new Date(),
        })
      } catch (error) {
        console.error("Error updating driver availability:", error)
        socket.emit("error", { message: "Failed to update availability" })
      }
    })

    socket.on("admin:broadcast", (data) => {
      if (socket.userRole !== "admin") {
        return socket.emit("error", { message: "Admin access required" })
      }

      const { message, targetRole } = data

      if (targetRole === "all") {
        socket.broadcast.emit("admin:notification", {
          message,
          timestamp: new Date(),
        })
      } else if (targetRole === "drivers") {
        socket.to("drivers").emit("admin:notification", {
          message,
          timestamp: new Date(),
        })
      }
    })

    
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.userId}`)

      
      if (socket.userRole === "driver") {
        try {
          await Driver.findOneAndUpdate(
            { user: socket.userId },
            {
              isOnline: false,
              lastSeen: new Date(),
            },
          )
        } catch (error) {
          console.error("Error updating driver offline status:", error)
        }
      }
    })

    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error)
    })
  })

  return io
}


export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized")
  }
  return io
}

export const sendToUser = (userId, event, data) => {
  if (!io) return false

  io.to(`user:${userId}`).emit(event, {
    ...data,
    timestamp: new Date(),
  })
  return true
}

export const sendToDrivers = (event, data) => {
  if (!io) return false

  io.to("drivers").emit(event, {
    ...data,
    timestamp: new Date(),
  })
  return true
}


export const sendToAdmins = (event, data) => {
  if (!io) return false

  io.to("admins").emit(event, {
    ...data,
    timestamp: new Date(),
  })
  return true
}


export const broadcast = (event, data) => {
  if (!io) return false

  io.emit(event, {
    ...data,
    timestamp: new Date(),
  })
  return true
}


export const getConnectedUsersCount = () => {
  if (!io) return 0
  return io.engine.clientsCount
}


export const getConnectedDriversCount = async () => {
  if (!io) return 0

  const sockets = await io.in("drivers").fetchSockets()
  return sockets.length
}


export const isUserOnline = async (userId) => {
  if (!io) return false

  const sockets = await io.in(`user:${userId}`).fetchSockets()
  return sockets.length > 0
}
