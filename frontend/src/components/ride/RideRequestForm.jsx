"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Clock, Car } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { useRide } from "../../hooks/useRide"
import { useGeolocation } from "../../hooks/useGeolocation"
import { VEHICLE_TYPES, PAYMENT_METHODS } from "../../utils/constants"
import { formatCurrency } from "../../utils/helpers"

const RideRequestForm = () => {
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)
  const { requestRide, loading } = useRide()
  const { location, getCurrentLocation } = useGeolocation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicleType: VEHICLE_TYPES.STANDARD,
      passengers: 1,
      paymentMethod: PAYMENT_METHODS.CARD,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (location) {
      setValue("pickupLat", location.latitude)
      setValue("pickupLng", location.longitude)
    }
  }, [location, setValue])

  // Mock price calculation
  useEffect(() => {
    if (watchedValues.pickup && watchedValues.destination) {
      // Simulate price calculation
      const basePrice = 5
      const distancePrice = Math.random() * 20 + 5
      const typeMultiplier = {
        economy: 1,
        standard: 1.2,
        premium: 1.5,
        suv: 1.8,
      }
      const total = (basePrice + distancePrice) * typeMultiplier[watchedValues.vehicleType]
      setEstimatedPrice(total)
      setEstimatedTime(Math.floor(Math.random() * 20) + 5)
    }
  }, [watchedValues.pickup, watchedValues.destination, watchedValues.vehicleType])

  const onSubmit = async (data) => {
    try {
      const rideData = {
        pickup: {
          address: data.pickup,
          location: {
            type: "Point",
            coordinates: [data.pickupLng, data.pickupLat],
          },
        },
        destination: {
          address: data.destination,
          location: {
            type: "Point",
            coordinates: [data.destinationLng, data.destinationLat],
          },
        },
        vehicleType: data.vehicleType,
        passengers: Number.parseInt(data.passengers),
        paymentMethod: data.paymentMethod,
        scheduledTime: data.scheduledTime || null,
        notes: data.notes || "",
      }

      await requestRide(rideData)
      toast.success("Ride requested successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to request ride")
    }
  }

  const vehicleOptions = [
    { value: VEHICLE_TYPES.ECONOMY, label: "Economy", icon: "🚗", description: "Affordable rides" },
    { value: VEHICLE_TYPES.STANDARD, label: "Standard", icon: "🚙", description: "Comfortable rides" },
    { value: VEHICLE_TYPES.PREMIUM, label: "Premium", icon: "🚘", description: "Luxury experience" },
    { value: VEHICLE_TYPES.SUV, label: "SUV", icon: "🚐", description: "Extra space" },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-dark mb-2">Request a Ride</h2>
          <p className="text-text-secondary">Where would you like to go?</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Location inputs */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Pickup Location"
                placeholder="Enter pickup address"
                icon={<MapPin className="w-5 h-5 text-green-500" />}
                error={errors.pickup?.message}
                {...register("pickup", { required: "Pickup location is required" })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-8"
                onClick={getCurrentLocation}
              >
                Use Current
              </Button>
            </div>

            <Input
              label="Destination"
              placeholder="Enter destination address"
              icon={<MapPin className="w-5 h-5 text-red-500" />}
              error={errors.destination?.message}
              {...register("destination", { required: "Destination is required" })}
            />

            {/* Hidden coordinates */}
            <input type="hidden" {...register("pickupLat")} />
            <input type="hidden" {...register("pickupLng")} />
            <input type="hidden" {...register("destinationLat")} />
            <input type="hidden" {...register("destinationLng")} />
          </div>

          {/* Vehicle type selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-4">Choose Vehicle Type</label>
            <div className="grid grid-cols-2 gap-4">
              {vehicleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${
                      watchedValues.vehicleType === option.value
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-border-color hover:border-primary hover:bg-primary hover:bg-opacity-5"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register("vehicleType", { required: "Please select a vehicle type" })}
                  />
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-semibold text-text-dark">{option.label}</div>
                  <div className="text-xs text-text-secondary text-center">{option.description}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Number of Passengers</label>
              <select
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("passengers", { required: "Please select number of passengers" })}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Payment Method</label>
              <select
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("paymentMethod")}
              >
                <option value={PAYMENT_METHODS.CARD}>Credit/Debit Card</option>
                <option value={PAYMENT_METHODS.CASH}>Cash</option>
                <option value={PAYMENT_METHODS.WALLET}>Digital Wallet</option>
              </select>
            </div>
          </div>

          {/* Schedule ride */}
          <Input
            label="Schedule for Later (Optional)"
            type="datetime-local"
            icon={<Clock className="w-5 h-5" />}
            {...register("scheduledTime")}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Special Instructions (Optional)</label>
            <textarea
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              placeholder="Any special instructions for the driver..."
              {...register("notes")}
            />
          </div>

          {/* Price estimate */}
          {estimatedPrice && (
            <Card className="bg-bg-main border-primary border-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold text-text-dark">Estimated Fare</div>
                  <div className="text-sm text-text-secondary">Estimated arrival: {estimatedTime} minutes</div>
                </div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(estimatedPrice)}</div>
              </div>
            </Card>
          )}

          {/* Submit button */}
          <Button type="submit" loading={loading} className="w-full" size="lg" icon={<Car className="w-5 h-5" />}>
            {watchedValues.scheduledTime ? "Schedule Ride" : "Request Ride Now"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default RideRequestForm
