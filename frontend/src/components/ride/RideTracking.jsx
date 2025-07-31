"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, MessageCircle, Navigation, Clock, User } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatTime } from "../../utils/helpers"

const RideTracking = ({ rideId }) => {
  const { currentRide, loading } = useRide()
  const [estimatedArrival, setEstimatedArrival] = useState(null)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentRide?.status === RIDE_STATUS.ACCEPTED) {
        setEstimatedArrival(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutes from now
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentRide])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading ride details...</p>
        </div>
      </div>
    )
  }

  if (!currentRide) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-text-dark mb-2">No active ride</h3>
        <p className="text-text-secondary">You don't have any active rides to track</p>
      </div>
    )
  }

  const getStatusMessage = (status) => {
    const messages = {
      [RIDE_STATUS.SEARCHING]: "Finding a driver for you...",
      [RIDE_STATUS.ACCEPTED]: "Driver is on the way to pick you up",
      [RIDE_STATUS.ARRIVED]: "Driver has arrived at pickup location",
      [RIDE_STATUS.IN_PROGRESS]: "You're on your way to destination",
    }
    return messages[status] || "Ride in progress"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case RIDE_STATUS.SEARCHING:
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      case RIDE_STATUS.ACCEPTED:
        return <Navigation className="w-6 h-6 text-blue-500" />
      case RIDE_STATUS.ARRIVED:
        return <MapPin className="w-6 h-6 text-green-500" />
      case RIDE_STATUS.IN_PROGRESS:
        return <Navigation className="w-6 h-6 text-purple-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Status Card */}
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">{getStatusIcon(currentRide.status)}</div>
        <h2 className="text-xl font-semibold text-text-dark mb-2">{getStatusMessage(currentRide.status)}</h2>
        {estimatedArrival && currentRide.status === RIDE_STATUS.ACCEPTED && (
          <p className="text-text-secondary">Estimated arrival: {formatTime(estimatedArrival)}</p>
        )}
      </Card>

      {/* Map Placeholder */}
      <Card className="p-0 overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary to-text-secondary flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-80" />
            <p className="text-lg font-medium">Live Map View</p>
            <p className="text-sm opacity-80">Track your ride in real-time</p>
          </div>
        </div>
      </Card>

      {/* Route Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-dark mb-4">Trip Details</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-text-dark">Pickup</p>
              <p className="text-sm text-text-secondary">{currentRide.pickup.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-text-dark">Destination</p>
              <p className="text-sm text-text-secondary">{currentRide.destination.address}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Driver Information */}
      {currentRide.driver && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Your Driver</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-dark">
                {currentRide.driver.user?.firstName} {currentRide.driver.user?.lastName}
              </h4>
              <p className="text-sm text-text-secondary">
                {currentRide.driver.vehicle?.make} {currentRide.driver.vehicle?.model}
              </p>
              <p className="text-sm text-text-secondary">
                {currentRide.driver.vehicle?.color} • {currentRide.driver.vehicle?.licensePlate}
              </p>
              {currentRide.driver.user?.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-text-secondary">{currentRide.driver.user.rating}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<Phone className="w-4 h-4 bg-transparent" />}
              className="flex-1 bg-transparent"
            >
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<MessageCircle className="w-4 h-4 bg-transparent" />}
              className="flex-1 bg-transparent"
            >
              Message
            </Button>
          </div>
        </Card>
      )}

      {/* Fare Information */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-text-dark">Trip Fare</h3>
            <p className="text-sm text-text-secondary">Payment via {currentRide.payment.method}</p>
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(currentRide.price.total)}</div>
        </div>
      </Card>

      {/* Cancel Button */}
      {[RIDE_STATUS.SEARCHING, RIDE_STATUS.ACCEPTED].includes(currentRide.status) && (
        <Button variant="danger" className="w-full">
          Cancel Ride
        </Button>
      )}
    </div>
  )
}

export default RideTracking
