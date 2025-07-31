"use client"

import { MapPin, Clock, Star, User, Car } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { formatCurrency, formatDate, formatDistance } from "../../utils/helpers"
import { RIDE_STATUS } from "../../utils/constants"

const RideCard = ({ ride, onCancel, onRate, onViewDetails, showActions = true }) => {
  const getStatusColor = (status) => {
    const colors = {
      [RIDE_STATUS.REQUESTED]: "text-blue-600 bg-blue-100",
      [RIDE_STATUS.SEARCHING]: "text-yellow-600 bg-yellow-100",
      [RIDE_STATUS.ACCEPTED]: "text-green-600 bg-green-100",
      [RIDE_STATUS.ARRIVED]: "text-purple-600 bg-purple-100",
      [RIDE_STATUS.IN_PROGRESS]: "text-indigo-600 bg-indigo-100",
      [RIDE_STATUS.COMPLETED]: "text-green-600 bg-green-100",
      [RIDE_STATUS.CANCELLED]: "text-red-600 bg-red-100",
      [RIDE_STATUS.NO_DRIVER]: "text-gray-600 bg-gray-100",
    }
    return colors[status] || "text-gray-600 bg-gray-100"
  }

  const getStatusText = (status) => {
    const texts = {
      [RIDE_STATUS.REQUESTED]: "Requested",
      [RIDE_STATUS.SEARCHING]: "Finding Driver",
      [RIDE_STATUS.ACCEPTED]: "Driver Assigned",
      [RIDE_STATUS.ARRIVED]: "Driver Arrived",
      [RIDE_STATUS.IN_PROGRESS]: "In Progress",
      [RIDE_STATUS.COMPLETED]: "Completed",
      [RIDE_STATUS.CANCELLED]: "Cancelled",
      [RIDE_STATUS.NO_DRIVER]: "No Driver Available",
    }
    return texts[status] || status
  }

  const canCancel = [RIDE_STATUS.REQUESTED, RIDE_STATUS.SEARCHING, RIDE_STATUS.ACCEPTED].includes(ride.status)
  const canRate = ride.status === RIDE_STATUS.COMPLETED && !ride.rating?.passenger

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
              {getStatusText(ride.status)}
            </span>
            <span className="text-sm text-text-secondary">{formatDate(ride.createdAt)}</span>
          </div>

          {/* Route */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-text-dark truncate">{ride.pickup.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-text-dark truncate">{ride.destination.address}</span>
            </div>
          </div>

          {/* Ride details */}
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span className="capitalize">{ride.vehicleType}</span>
            </div>
            {ride.distance && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistance(ride.distance)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                {ride.passengers} passenger{ride.passengers > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Driver info (if assigned) */}
          {ride.driver && (
            <div className="flex items-center gap-3 p-3 bg-bg-main rounded-lg mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-text-dark">
                  {ride.driver.user?.firstName} {ride.driver.user?.lastName}
                </div>
                <div className="text-sm text-text-secondary">
                  {ride.driver.vehicle?.make} {ride.driver.vehicle?.model} • {ride.driver.vehicle?.color}
                </div>
                {ride.driver.user?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{ride.driver.user.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-primary">{formatCurrency(ride.price.total)}</div>
          <div className="text-sm text-text-secondary">{ride.payment.method}</div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-border-color">
          <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(ride)} className="flex-1">
            View Details
          </Button>
          {canRate && (
            <Button variant="outline" size="sm" onClick={() => onRate?.(ride)} className="flex-1 bg-transparent">
              Rate Ride
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" size="sm" onClick={() => onCancel?.(ride)} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}

export default RideCard
