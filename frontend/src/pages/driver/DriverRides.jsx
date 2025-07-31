"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, User, Phone, MessageCircle, Navigation } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useSelector, useDispatch } from "react-redux"
import { getDriverRides, acceptRide } from "../../redux/slices/driverSlice"
import { formatCurrency, formatDistance, formatTime } from "../../utils/helpers"
import { RIDE_STATUS } from "../../utils/constants"

const DriverRides = () => {
  const dispatch = useDispatch()
  const { rides, loading, isOnline } = useSelector((state) => state.driver)
  const [filter, setFilter] = useState("available")

  useEffect(() => {
    if (isOnline) {
      loadRides()
      // Set up polling for new rides
      const interval = setInterval(loadRides, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isOnline, filter])

  const loadRides = () => {
    const params = {
      status: filter === "available" ? "requested" : filter,
      limit: 20,
    }
    dispatch(getDriverRides(params))
  }

  const handleAcceptRide = async (rideId) => {
    try {
      await dispatch(acceptRide(rideId)).unwrap()
    } catch (error) {
      console.error("Failed to accept ride:", error)
    }
  }

  const filterOptions = [
    { value: "available", label: "Available Rides" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const RideCard = ({ ride }) => {
    const isAvailable = ride.status === RIDE_STATUS.REQUESTED
    const isAccepted = ride.status === RIDE_STATUS.ACCEPTED
    const estimatedEarnings = ride.price.total * 0.8 // 80% to driver

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAvailable
                    ? "bg-green-100 text-green-800"
                    : isAccepted
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {isAvailable ? "Available" : ride.status}
              </span>
              <span className="text-sm text-text-secondary">{formatTime(ride.createdAt)}</span>
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

            {/* Trip details */}
            <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>
                  {ride.passengers} passenger{ride.passengers > 1 ? "s" : ""}
                </span>
              </div>
              {ride.distance && (
                <div className="flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  <span>{formatDistance(ride.distance)}</span>
                </div>
              )}
              {ride.estimatedDuration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(ride.estimatedDuration / 60)} min</span>
                </div>
              )}
            </div>

            {/* Passenger info (if accepted) */}
            {isAccepted && ride.passenger && (
              <div className="flex items-center gap-3 p-3 bg-bg-main rounded-lg mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-dark">
                    {ride.passenger.firstName} {ride.passenger.lastName}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {ride.passenger.rating && `★ ${ride.passenger.rating}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Phone className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<MessageCircle className="w-4 h-4" />} />
                </div>
              </div>
            )}
          </div>

          {/* Earnings */}
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(estimatedEarnings)}</div>
            <div className="text-sm text-text-secondary">Estimated earnings</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border-color">
          {isAvailable && (
            <>
              <Button onClick={() => handleAcceptRide(ride._id)} className="flex-1">
                Accept Ride
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                View Route
              </Button>
            </>
          )}

          {isAccepted && (
            <>
              <Button className="flex-1">Navigate to Pickup</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Arrived
              </Button>
            </>
          )}

          {ride.status === RIDE_STATUS.COMPLETED && (
            <Button variant="ghost" className="w-full">
              View Details
            </Button>
          )}
        </div>
      </Card>
    )
  }

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-4">You're Currently Offline</h2>
          <p className="text-text-secondary mb-6">Go online to start receiving ride requests and earning money.</p>
          <Button>Go Online</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Available Rides</h1>
          <p className="text-text-secondary">Accept rides and start earning</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={filter !== option.value ? "bg-transparent" : ""}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Rides List */}
        {loading ? (
          <Loading text="Loading rides..." />
        ) : rides.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-placeholder-text" />
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              {filter === "available" ? "No rides available" : "No rides found"}
            </h3>
            <p className="text-text-secondary">
              {filter === "available"
                ? "Check back in a few minutes for new ride requests"
                : "Try adjusting your filter to see more rides"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverRides
