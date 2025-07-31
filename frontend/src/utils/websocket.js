import { store } from "../redux/store"
import { updateRideStatus } from "../redux/slices/rideSlice"
import { addNotification } from "../redux/slices/uiSlice"
import { toast } from "react-hot-toast"

class WebSocketService {
  constructor() {
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 5000
  }

  connect(token) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"
    this.socket = new WebSocket(`${wsUrl}?token=${token}`)

    this.socket.onopen = () => {
      console.log("WebSocket connected")
      this.reconnectAttempts = 0
      toast.success("Connected to real-time updates")
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    this.socket.onclose = () => {
      console.log("WebSocket disconnected")
      this.attemptReconnect(token)
    }

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  handleMessage(data) {
    const { type, payload } = data

    switch (type) {
      case "ride_status_update":
        store.dispatch(updateRideStatus(payload.status))
        store.dispatch(
          addNotification({
            type: "info",
            title: "Ride Update",
            message: payload.message,
          }),
        )
        break

      case "new_ride_request":
        store.dispatch(
          addNotification({
            type: "info",
            title: "New Ride Request",
            message: `New ride from ${payload.pickup} to ${payload.destination}`,
          }),
        )
        toast.info("New ride request available!")
        break

      case "ride_accepted":
        store.dispatch(updateRideStatus("accepted"))
        store.dispatch(
          addNotification({
            type: "success",
            title: "Ride Accepted",
            message: `Driver ${payload.driverName} accepted your ride`,
          }),
        )
        toast.success("Your ride has been accepted!")
        break

      case "driver_arrived":
        store.dispatch(updateRideStatus("arrived"))
        store.dispatch(
          addNotification({
            type: "info",
            title: "Driver Arrived",
            message: "Your driver has arrived at the pickup location",
          }),
        )
        toast.info("Your driver has arrived!")
        break

      case "ride_started":
        store.dispatch(updateRideStatus("inProgress"))
        store.dispatch(
          addNotification({
            type: "info",
            title: "Ride Started",
            message: "Your ride has started",
          }),
        )
        break

      case "ride_completed":
        store.dispatch(updateRideStatus("completed"))
        store.dispatch(
          addNotification({
            type: "success",
            title: "Ride Completed",
            message: "Your ride has been completed successfully",
          }),
        )
        toast.success("Ride completed!")
        break

      case "ride_cancelled":
        store.dispatch(updateRideStatus("cancelled"))
        store.dispatch(
          addNotification({
            type: "warning",
            title: "Ride Cancelled",
            message: payload.reason || "Your ride has been cancelled",
          }),
        )
        toast.error("Ride cancelled")
        break

      default:
        console.log("Unknown message type:", type)
    }
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.connect(token)
      }, this.reconnectInterval)
    } else {
      console.log("Max reconnection attempts reached")
      toast.error("Connection lost. Please refresh the page.")
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  send(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.error("WebSocket is not connected")
    }
  }
}

export const websocketService = new WebSocketService()
