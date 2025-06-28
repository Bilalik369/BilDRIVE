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
}