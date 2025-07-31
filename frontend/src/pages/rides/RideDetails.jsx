"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, User, Car, Star, Phone, MessageCircle } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { ridesAPI } from "../../utils/api"
import { formatCurrency, formatDate, formatDistance } from "../../utils/helpers"
import { RIDE_STATUS } from "../../utils/constants"

const RideDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRideDetails()
  }, [id])

  const loadRideDetails = async () => {
    try {
      const response = await ridesAPI.getDetails(id)
      setRide(response.data.ride)
    } catch (error) {
      console.error("Failed to load ride details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      [RIDE_STATUS.REQUESTED]: "text-blue-600 bg-blue-100",
      [RIDE_STATUS.SEARCHING]: "text-yellow-600 bg-yellow-100",
      [RIDE_STATUS.ACCEPTED]: "text-green-600 bg-green-100",
      [RIDE_STATUS.ARRIVED]: "text-purple-600 bg-purple-100",
      [RIDE_STATUS.IN_PROGRESS]: "text-indigo-600 bg-indigo-100",
      [RIDE_STATUS.COMPLETED]: "text-green-600 bg-green-100",
      [RIDE_STATUS.CANCELLED]: "text-red-600 bg-red-100",
    }
    return colors[status] || "text-gray-600 bg-gray-100"
  }

  if (loading) {
    return <Loading text="Loading ride details..." fullScreen />
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-text-dark mb-4">Ride Not Found</h2>
          <p className="text-text-secondary mb-6">The ride you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/rides/history")}>Back to History</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Ride Details</h1>
            <p className="text-text-secondary">Ride ID: {ride._id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                  <p className="text-text-secondary mt-2">{formatDate(ride.createdAt)}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(ride.price.total)}</div>
                  <div className="text-sm text-text-secondary">{ride.payment.method}</div>
                </div>
              </div>

              {/* Route */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-text-dark">Pickup Location</h3>
                    <p className="text-text-secondary">{ride.pickup.address}</p>
                    {ride.pickup.notes && <p className="text-sm text-text-secondary mt-1">Note: {ride.pickup.notes}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-text-dark">Destination</h3>
                    <p className="text-text-secondary">{ride.destination.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trip Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Trip Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-text-secondary">Vehicle Type</div>
                  <div className="font-medium text-text-dark capitalize">{ride.vehicleType}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Passengers</div>
                  <div className="font-medium text-text-dark">{ride.passengers}</div>
                </div>
                {ride.distance && (
                  <div>
                    <div className="text-sm text-text-secondary">Distance</div>
                    <div className="font-medium text-text-dark">{formatDistance(ride.distance)}</div>
                  </div>
                )}
                {ride.duration && (
                  <div>
                    <div className="text-sm text-text-secondary">Duration</div>
                    <div className="font-medium text-text-dark">{Math.round(ride.duration / 60)} min</div>
                  </div>
                )}
              </div>

              {ride.notes && (
                <div className="mt-4 p-4 bg-bg-main rounded-lg">
                  <h3 className="font-medium text-text-dark mb-2">Special Instructions</h3>
                  <p className="text-text-secondary">{ride.notes}</p>
                </div>
              )}
            </Card>

            {/* Price Breakdown */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Price Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Base Fare</span>
                  <span className="text-text-dark">{formatCurrency(ride.price.base)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Distance ({formatDistance(ride.distance || 0)})</span>
                  <span className="text-text-dark">{formatCurrency(ride.price.distance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Time ({Math.round((ride.duration || 0) / 60)} min)</span>
                  <span className="text-text-dark">{formatCurrency(ride.price.time || 0)}</span>
                </div>
                {ride.price.surge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Surge Pricing</span>
                    <span className="text-text-dark">{formatCurrency(ride.price.surge)}</span>
                  </div>
                )}
                {ride.price.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(ride.price.discount)}</span>
                  </div>
                )}
                <hr className="border-border-color" />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-text-dark">Total</span>
                  <span className="text-primary">{formatCurrency(ride.price.total)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Driver Info */}
            {ride.driver && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Driver Information</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    {ride.driver.user?.profilePicture ? (
                      <img
                        src={ride.driver.user.profilePicture || "/placeholder.svg"}
                        alt="Driver"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">
                      {ride.driver.user?.firstName} {ride.driver.user?.lastName}
                    </h3>
                    {ride.driver.user?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-text-secondary">{ride.driver.user.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-dark">
                      {ride.driver.vehicle?.make} {ride.driver.vehicle?.model}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {ride.driver.vehicle?.color} • {ride.driver.vehicle?.licensePlate}
                  </div>
                </div>

                {/* Contact Buttons */}
                {[RIDE_STATUS.ACCEPTED, RIDE_STATUS.ARRIVED, RIDE_STATUS.IN_PROGRESS].includes(ride.status) && (
                  <div className="flex gap-2">
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
                )}
              </Card>
            )}

            {/* Rating */}
            {ride.status === RIDE_STATUS.COMPLETED && ride.rating && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Your Rating</h2>
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= ride.rating.passenger.value ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-lg font-semibold text-text-dark">{ride.rating.passenger.value}/5</div>
                  {ride.rating.passenger.comment && (
                    <p className="text-text-secondary mt-2 text-sm">"{ride.rating.passenger.comment}"</p>
                  )}
                </div>
              </Card>
            )}

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Report Issue
                </Button>
                {ride.status === RIDE_STATUS.COMPLETED && !ride.rating && (
                  <Button className="w-full">Rate This Ride</Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RideDetails
